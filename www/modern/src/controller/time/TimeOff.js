Ext.define('ess.controller.time.TimeOff', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_time_timeoff',

        requires : [
            'ess.view.time.timeOff.CancelRequest'
        ],

        mixins : [
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        onSelectTimeOffType : function(timeOffTypeCd) {
        },

        handlePainted : function() {
            var employeeId = this.getRecord().get('employeeId');

            this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIME_OFF);

            this.callParent(arguments);
        },

        handleCancel : function() {
            var me = this,
                vm = this.getViewModel();

            this.lookup('timeBalancesDataView').deselectAll();

            if (vm.get('isDirty')) {
                Ext.Msg.show({
                    ui : 'rounded',
                    title : i18n.gettext('Save'),
                    message : i18n.gettext('Do you want to save this Time Off before closing it?'),
                    buttons : [
                        {text : i18n.gettext('Don\'t Save'), itemId : 'no', cls : 'cancel-btn'},
                        {
                            text : i18n.gettext('Save'),
                            itemId : 'yes'
                        }
                    ],
                    prompt : false,
                    scope : this,
                    fn : function(btn) {
                        if (btn === 'yes') {
                            me.handleSave();
                        } else {
                            me.superclass.handleCancel.apply(me, arguments);
                        }
                    }
                });
            } else {
                me.callParent(arguments);
            }
        },

        deleteRecord : function() {
            // for prevent load details for deleted record
            this.getViewModel().set('record.details', Ext.create('Ext.data.Store'));

            this.getRecord().erase();
            this.close();
        },

        onStartDateChange : function(cmp, val) {
            var record = this.getRecord();

            if (record && record.phantom) {
                record.set('endDate', val);
            }
        },

        handleSave : function() {
            this.saveTimeOff();
        },

        handleSubmit : function() {
            this.saveTimeOff(this.submitTimeOffCallback);
        },

        saveTimeOff : function(callback) {
            var me = this,
                record = me.getRecord(),
                view = me.getView();

            if (view.isValid() && record) {

                if (!record.phantom && record.hasEmptyDetails()) {
                    record.eraseWithPromise().then({
                        scope : this,
                        success : function() {
                            me.close();
                        }
                    });

                    return;
                }

                if (record.phantom) {
                    me.checkTimeOffSplitting(record)
                        .then({
                            scope : this,
                            success : function(response) {
                                me.confirmIfTimeOffCanBeSplittedAndSave(response, record, callback);
                            }
                        });
                } else {
                    record.saveWithPromise().then({
                        scope : this,
                        success : function() {
                            criterion.Utils.toast(i18n.gettext('The Time Off is saved.'));

                            this.getView().fireEvent('afterSave', record);

                            if (callback) {
                                callback(record, this, [record.getId()]);
                            } else {
                                this.close();
                            }
                        }
                    });
                }
            }
        },

        prepareTimeOffDetails : function(record) {
            var endDate = record.get('endDate'),
                startDate = record.get('startDateForCreate'),
                timeOffDetails;

            timeOffDetails = record.details();
            timeOffDetails.removeAll();
            timeOffDetails.add(this._createDetailObject(record, startDate));

            if (endDate && (startDate.getTime() < endDate.getTime())) {
                endDate = Ext.Date.add(endDate, Ext.Date.HOUR, 1); // correction for Daylight Saving Time (DST)
                for (var i = 1; i <= Ext.Date.diff(startDate, endDate, Ext.Date.DAY); i++) {
                    timeOffDetails.add(this._createDetailObject(record, Ext.Date.add(startDate, Ext.Date.DAY, i)));
                }
            }

            return timeOffDetails;
        },

        checkTimeOffSplitting : function(record) {
            var timeOffDetails = this.prepareTimeOffDetails(record);

            return criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_CHECK_SPLITTING,
                jsonData : {
                    employeeId : record.get('employeeId'),
                    timeOffTypeCd : record.get('timeOffTypeCd'),
                    notes : record.get('notes'),
                    details : Ext.Array.map(Ext.Array.clone(timeOffDetails.getDataAsArray()), function(detail) {
                        detail.timeOffDate = Ext.Date.format(detail.timeOffDate, criterion.consts.Api.RAW_DATE_TIME_FORMAT);
                        return detail;
                    })
                }
            });
        },

        confirmIfTimeOffCanBeSplittedAndSave : function(response, record, callback) {
            var me = this;

            if (response.isSplitted) {
                var messageBody,
                    linkedPlansInfoFormatted,
                    title = i18n.gettext('Please, confirm'),
                    buttons = [
                        {text : i18n.gettext('Cancel'), itemId : 'no', cls : 'cancel-btn'},
                        {
                            text : i18n.gettext('Ok'),
                            itemId : 'yes'
                        }
                    ],
                    totalDuration = Ext.util.Format.plural(Ext.util.Format.employerAmountPrecision(response.duration / 60), 'hour', 'hours');

                linkedPlansInfoFormatted = Ext.Array.map(response.linkedPlansInfo, function(linkedPlanInfo) {
                    var duration = Ext.util.Format.plural(Ext.util.Format.employerAmountPrecision(linkedPlanInfo.duration / 60), 'hour', 'hours');

                    return Ext.util.Format.format('{0}: {1}', linkedPlanInfo.planTitle, duration);
                }).join('<br />');

                messageBody = Ext.util.Format.format(i18n.gettext('Your request for {0} of {1} will be split in to<br /><br />{2}'), totalDuration, response.planTitle, linkedPlansInfoFormatted);

                if (callback) {
                    // if callback is defined it means that user tries to submit the timeoff
                    if (!response.canBeSubmitted) {
                        title = i18n.gettext('Warning');
                        buttons = [
                            {text : i18n.gettext('Cancel'), itemId : 'no', cls : 'cancel-btn'}
                        ];
                        linkedPlansInfoFormatted = Ext.Array.map(response.linkedPlansInfo, function(linkedPlanInfo) {
                            var duration;

                            if (Ext.isDefined(linkedPlanInfo.availableDuration)) {
                                duration = Ext.util.Format.format(i18n.gettext('{0} remaining'), Ext.util.Format.plural(Ext.util.Format.employerAmountPrecision(linkedPlanInfo.availableDuration / 60), 'hour', 'hours'));
                            } else {
                                return null;
                            }

                            return Ext.util.Format.format('{0}: {1}', linkedPlanInfo.planTitle, duration);
                        }).join('<br />');

                        messageBody = Ext.util.Format.format(i18n.gettext('You do not have enough time accrued to request {0} time off in the following plans:<br /><br />{1}'), totalDuration, linkedPlansInfoFormatted);
                    }
                }

                Ext.Msg.show({
                    ui : 'rounded',
                    title : title,
                    message : messageBody,
                    buttons : buttons,
                    prompt : false,
                    scope : me,
                    fn : function(btn) {
                        if (btn === 'yes') {
                            me.splitAndSaveTimeOff(record, callback);
                        }
                    }
                });
            } else {
                me.splitAndSaveTimeOff(record, callback, {saveOnly : true});
            }
        },

        splitAndSaveTimeOff : function(record, callback, options) {
            var timeOffDetails = Ext.Array.clone(record.details().getDataAsArray()),
                _options = {saveOnly : false};

            if (Ext.isObject(options)) {
                _options = Ext.Object.merge(_options, options);
            }

            criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_SPLIT_AND_CREATE,
                jsonData : {
                    employeeId : record.get('employeeId'),
                    timeOffTypeCd : record.get('timeOffTypeCd'),
                    notes : record.get('notes'),
                    details : Ext.Array.map(timeOffDetails, function(detail) {
                        detail.timeOffDate = Ext.Date.format(detail.timeOffDate, criterion.consts.Api.RAW_DATE_TIME_FORMAT);
                        return detail;
                    })
                }
            }).then({
                scope : this,
                success : function(response) {
                    var scope = this,
                        notification = 'The Time Off is splitted and saved.';

                    if (_options.saveOnly) {
                        notification = 'The Time Off is saved.'
                    }
                    criterion.Utils.toast(i18n.gettext(notification));

                    scope.getView().fireEvent('afterSave', record);

                    if (callback) {
                        callback(record, scope, response && response['ids']);
                    } else {
                        scope.close();
                    }
                }
            });
        },

        submitTimeOffCallback : function(record, scope, ids) {
            var me = scope,
                view = me.getView(),
                employeeId = record.get('employeeId');

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIME_OFF).then(function(signature) {
                var jsonData = {
                    employeeId : employeeId,
                    timeOffIds : ids
                };

                view.setLoading(true);

                if (signature) {
                    jsonData['signature'] = signature;
                }

                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_SUBMIT,
                    jsonData : jsonData
                }).then({
                    scope : this,
                    success : function(response) {
                        criterion.Utils.toast(i18n.gettext('The Time Off is submitted.'));
                        scope.getView().fireEvent('submitted', record);
                    }
                }).always(function() {
                    scope.close();
                    view.setLoading(false);
                });
            });
        },

        getTimeOffDate : function(record, timeOffDateIn) {
            var startTime = record.get('startTime'),
                timeOffDate = timeOffDateIn || record.get('timeOffDate');

            return Ext.Date.parse(
                Ext.Date.format(timeOffDate, 'Y-m-d') + ' ' + (startTime ? Ext.Date.format(startTime, 'g:i A') : '12:00 AM'),
                'Y-m-d g:i A'
            );
        },

        _createDetailObject : function(record, timeOffDate) {
            var duration = record.get('duration'),
                startTime = record.get('startTime'),
                isFullDay = record.get('isFullDay'),
                employeeTimeOffId = record.getId();

            var dataTimeOffDetail = {
                employeeTimeOffId : employeeTimeOffId,
                timeOffDate : timeOffDate,
                timezoneCd : record.get('timezoneCd'),
                timezoneDescription : record.get('timezoneDescription')
            };

            if (!isFullDay) {
                dataTimeOffDetail.duration = duration;
                dataTimeOffDetail.startTime = startTime;
                dataTimeOffDetail.timeOffDate = this.getTimeOffDate(record, dataTimeOffDetail.timeOffDate)
            }

            dataTimeOffDetail.isFullDay = isFullDay;

            return dataTimeOffDetail;
        },

        handleAddTimeOffDetail : function() {
            this.getView().down('criterion_gridview').getController().add();
        },

        handleEditTimeOffDetail : function(record) {
            var vm = this.getViewModel(),
                parent = this.getView().up('ess_modern_time_timeoffs'),
                timeoffDetailForm = parent.down('criterion_time_timeoff_detail'),
                isAllDayOnly = vm.get('isAllDayOnly');

            if (vm.get('readOnlyMode')) {
                return;
            }

            if (!record.phantom) {
                record.set('startTime', record.get('timeOffDate'));
            }

            timeoffDetailForm.getViewModel().set({
                record : record,
                isAllDayOnly : isAllDayOnly
            });
            timeoffDetailForm.setIsAllDayOnly(isAllDayOnly);

            parent.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            parent.setActiveItem(timeoffDetailForm);
        },

        handleTypeChange : function(cmp, val, oldVal) {
            var vm = this.getViewModel(),
                type = cmp.getSelection(),
                isAllDayOnly = type ? type.get('isAllDayOnly') : false;

            vm.set('isAllDayOnly', isAllDayOnly);
            if (isAllDayOnly) {
                this.lookup('allDayToggler').setValue(true);
            }

            if (val && val !== oldVal) {
                this.onSelectTimeOffType(val);
                this.lookup('notes').setRequired(!type.get('notesOptional'));
            }

            if (!val) {
                this.lookup('timeBalancesDataView').deselectAll();
            }
        },

        handleCancelSubmit : function() {
            var cancelRequestConfirm = Ext.create('ess.view.time.timeOff.CancelRequest'),
                me = this,
                record = this.getRecord(),
                view = me.getView();

            cancelRequestConfirm.show({
                title : i18n.gettext('Cancel Request'),
                ui : 'rounded',
                message : '',
                buttons : [
                    {text : i18n.gettext('Cancel'), itemId : 'no', cls : 'cancel-btn'},
                    {
                        text : i18n.gettext('Submit'),
                        itemId : 'yes'
                    }
                ],
                prompt : true,
                scope : this,
                fn : (btn, data) => {
                    if (btn === 'yes') {

                        let deleteRequest = data[0],
                            comment = data[1];

                        view.setLoading(true);

                        criterion.Api.requestWithPromise({
                            url : Ext.util.Format.format(
                                criterion.consts.Api.API.EMPLOYEE_TIME_OFF_RECALL,
                                record.getId()
                            ) + '?employeeId=' + record.get('employeeId') + (deleteRequest ? '&delete=true' : ''),
                            method : 'PUT',
                            jsonData : comment ? {
                                comment : comment
                            } : {}
                        }).then({
                            success : function(result) {
                                view.fireEvent('submitted');
                                me.close();
                            }
                        }).always(function() {
                            view.setLoading(false);
                        });
                    }
                }
            });
        }
    };
});
