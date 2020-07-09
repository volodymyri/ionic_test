Ext.define('criterion.controller.employee.benefit.TimeOffForm', function() {

    let API = criterion.consts.Api.API,
        file, maxFileSize = criterion.Consts.ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB * 1048576;

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_benefit_time_off_form',

        requires : [
            'criterion.view.employee.benefit.TimeOffDetailForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        saveParams : null,

        loadRecord : function(record) {
            let vm = this.getViewModel(),
                timezoneCd = vm.get('timezoneCd'),
                timezoneDescription = vm.get('timezoneDescription'),
                detailsGrid = this.lookupReference('detailsGrid'),
                details;

            record.set({
                timezoneCd : timezoneCd,
                timezoneDescription : timezoneDescription
            });

            vm.set('record', record);

            vm.getStore('employeeTimeOffType').loadWithPromise({
                params : {
                    employeeId : record.get('employeeId')
                }
            });

            detailsGrid.setStore(null);

            if (!record.phantom) {
                details = record.details();

                details.each(function(rec) {
                    rec.set({
                        timezoneCd : timezoneCd,
                        timezoneDescription : timezoneDescription
                    });

                    rec.modified = {};
                });

                detailsGrid.setStore(details);
            }

            if (this.saveParams) {
                record.getProxy().setExtraParams(this.saveParams);
                details && details.getProxy().setExtraParams(this.saveParams);
            }

        },

        handleFullDayChange : function(cmp, val) {
            let vm = this.getViewModel(),
                record = vm.get('record');

            if (val) {
                record.set({
                    startTime : null,
                    duration : null
                });
            }
        },

        handleAddTimeoffDetail : function() {
            let vm = this.getViewModel();

            this._createTimeOffDetailForm(
                vm.get('record').details().add({
                    employeeTimeOffId : vm.get('record.id'),
                    timezoneCd : vm.get('timezoneCd'),
                    timezoneDescription : vm.get('timezoneDescription')
                })[0]
            )
        },

        handleEditTimeoffDetail : function(record) {
            this._createTimeOffDetailForm(record);
        },

        _createTimeOffDetailForm : function(record) {
            let timeOffDetailForm,
                vm = this.getViewModel(),
                view = this.getView(),
                isAllDayOnly = vm.get('isAllDayOnly');

            record.set('startTime', record.get('timeOffDate'));

            if (isAllDayOnly) {
                record.set('isFullDay', true);
            }

            timeOffDetailForm = Ext.create('criterion.view.employee.benefit.TimeOffDetailForm', {
                viewModel : {
                    data : {
                        record : record,
                        timezoneCd : vm.get('timezoneCd'),
                        timezoneDescription : vm.get('timezoneDescription'),
                        isAllDayOnly : isAllDayOnly,
                        security : vm.get('security')
                    }
                },
                timeFieldXType : view.timeFieldXType,
                allowDelete : true
            });

            timeOffDetailForm.show();
            timeOffDetailForm.on('save', this.onSetNewTimeOffDetail, this);
            timeOffDetailForm.on('cancel', this.onCancelNewTimeOffDetail, this);
            this.setCorrectMaskZIndex(true);
        },

        getTimeOffDate : function(record, timeOffDateIn) {
            let startTime = record.get('startTime'),
                timeOffDate = timeOffDateIn || record.get('timeOffDate');

            return Ext.Date.parse(
                Ext.Date.format(timeOffDate, 'Y-m-d') + ' ' + (startTime ? Ext.Date.format(startTime, 'g:i A') : '12:00 AM'),
                'Y-m-d g:i A'
            );
        },

        onSetNewTimeOffDetail : function(record) {
            record.set('timeOffDate', this.getTimeOffDate(record));

            this.setCorrectMaskZIndex(false);
        },

        onCancelNewTimeOffDetail : function(form, record) {
            let vm = this.getViewModel();

            this.setCorrectMaskZIndex(false);
            if (record.phantom) {
                vm.get('record').details().remove(record)
            } else {
                record.reject();
            }
        },

        handleRecordUpdate : function(record, scope, callback) {
            let endDate = record.get('endDate'),
                startDate = record.get('startDateForCreate'),
                timeOffDetails = record.details(),
                employeeId = record.get('employeeId'),
                view = this.getView();

            if (record.phantom) {
                timeOffDetails.removeAll();
                timeOffDetails.add(this._createDetailObject(record, startDate));

                if (endDate && (startDate.getTime() < endDate.getTime())) {
                    endDate = Ext.Date.add(endDate, Ext.Date.HOUR, 1); // correction for Daylight Saving Time (DST)
                    for (let i = 1; i <= Ext.Date.diff(startDate, endDate, Ext.Date.DAY); i++) {
                        timeOffDetails.add(this._createDetailObject(record, Ext.Date.add(startDate, Ext.Date.DAY, i)));
                    }
                }

                criterion.Api.requestWithPromise({
                    method : 'POST',
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_CHECK_SPLITTING,
                    jsonData : {
                        employeeId : employeeId,
                        timeOffTypeCd : record.get('timeOffTypeCd'),
                        notes : record.get('notes'),
                        details : Ext.Array.map(Ext.Array.clone(timeOffDetails.getDataAsArray()), function(detail) {
                            detail.timeOffDate = Ext.Date.format(detail.timeOffDate, criterion.consts.Api.RAW_DATE_TIME_FORMAT);
                            return detail;
                        })
                    }
                }).then({
                    scope : this,
                    success : function(response) {
                        this.confirmIfTimeOffCanBeSplittedAndSave(response, record, scope, callback);
                    }
                });
            } else {
                record.saveWithPromise().then({
                    scope : this,
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('The Time Off is saved.'));

                        view.fireEvent('afterSave', record, [record.getId()]);

                        if (callback) {
                            callback(record, scope, [record.getId()]);
                        } else {
                            this.close();
                        }
                    }
                });
            }
        },

        confirmIfTimeOffCanBeSplittedAndSave : function(response, record, scope, callback) {
            let me = this;

            if (response.isSplitted) {
                let messageBody,
                    linkedPlansInfoFormatted,
                    buttons = Ext.MessageBox.OKCANCEL,
                    icon = Ext.MessageBox.INFO,
                    totalDuration = Ext.util.Format.plural(response.duration / 60, 'hour', 'hours');

                linkedPlansInfoFormatted = Ext.Array.map(response.linkedPlansInfo, function(linkedPlanInfo) {
                    let duration = Ext.util.Format.plural(Ext.util.Format.employerAmountPrecision(linkedPlanInfo.duration / 60), 'hour', 'hours');

                    return Ext.util.Format.format('{0}: {1}', linkedPlanInfo.planTitle, duration);
                }).join('<br />');

                messageBody = Ext.util.Format.format(i18n.gettext('Your request for {0} of {1} will be split in to<br /><br />{2}'), totalDuration, response.planTitle, linkedPlansInfoFormatted);

                if (callback) {
                    // if callback is defined it means that user tries to submit the timeoff
                    if (!response.canBeSubmitted) {
                        icon = Ext.MessageBox.WARNING;
                        buttons = Ext.MessageBox.CANCEL;
                        linkedPlansInfoFormatted = Ext.Array.map(response.linkedPlansInfo, function(linkedPlanInfo) {
                            let duration;

                            if (Ext.isDefined(linkedPlanInfo.availableDuration)) {
                                duration = Ext.util.Format.format(i18n.gettext('{0} remaining'), Ext.util.Format.plural(linkedPlanInfo.availableDuration / 60, 'hour', 'hours'));
                            } else {
                                return null;
                            }

                            return Ext.util.Format.format('{0}: {1}', linkedPlanInfo.planTitle, duration);
                        }).join('<br />');

                        messageBody = Ext.util.Format.format(i18n.gettext('You do not have enough time accrued to request {0} time off in the following plans:<br /><br />{1}'), totalDuration, linkedPlansInfoFormatted);
                    }
                }

                criterion.Msg.confirm({
                    title : '',
                    message : messageBody,
                    icon : icon,
                    buttons : buttons,
                    minWidth : 480,
                    callback : function(btn) {
                        if (btn === 'ok') {
                            me.splitAndSaveTimeOff(record, scope, callback);
                        }
                    }
                });
            } else {
                me.splitAndSaveTimeOff(record, scope, callback, {saveOnly : true});
            }
        },

        splitAndSaveTimeOff : function(record, scope, callback, options) {
            let timeOffDetails = Ext.Array.clone(record.details().getDataAsArray()),
                _options = {saveOnly : false};

            if (Ext.isObject(options)) {
                _options = Ext.Object.merge(_options, options);
            }

            criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_SPLIT_AND_CREATE,
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
                    let _scope = Ext.isDefined(scope) ? scope : this,
                        notification = 'The Time Off is splitted and saved.';
                    if (_options.saveOnly) {
                        notification = 'The Time Off is saved.'
                    }
                    criterion.Utils.toast(i18n.gettext(notification));

                    _scope.getView().fireEvent('afterSave', record, response && response['ids']);

                    if (callback) {
                        callback(record, scope, response && response['ids']);
                    } else {
                        _scope.close();
                    }
                }
            });
        },

        handleSubmitClick : function() {
            let me = this,
                record = me.getRecord();

            if (!record.phantom && record.hasEmptyDetails()) {
                me.deleteRecord();
                return;
            }

            me.callParent();
        },

        _createDetailObject : function(record, timeOffDate) {
            let duration = record.get('duration'),
                isFullDay = record.get('isFullDay'),
                employeeTimeOffId = record.getId(),
                dataTimeOffDetail = {
                    timezoneCd : record.get('timezoneCd'),
                    employeeTimeOffId : employeeTimeOffId,
                    timeOffDate : this.getTimeOffDate(record, timeOffDate)
                };

            if (!isFullDay) {
                dataTimeOffDetail.duration = duration;
            }

            dataTimeOffDetail.isFullDay = isFullDay;

            return dataTimeOffDetail;
        },

        onStartDateChange : function(cmp, val) {
            let vm = this.getViewModel(),
                record = vm.get('record');

            if (record.phantom) {
                record.set('endDate', val);
            }
        },

        handleTypeChange : function(cmp, value) {
            let vm = this.getViewModel(),
                record = vm.get('record'),
                type = cmp.getSelection(),
                isAllDayOnly = type ? type.get('isAllDayOnly') : false;

            vm.set('isAllDayOnly', isAllDayOnly);
            if (isAllDayOnly) {
                record.set('isFullDay', isAllDayOnly);
            }
        },

        close : function() {
            if (this._blockClose) {
                return;
            }

            this.callParent(arguments);
        },

        handleSelectFile : function(event, cmp) {
            cmp && cmp.setValidation(true);

            file = event.target && event.target.files && event.target.files[0];

            if (file.size > maxFileSize) {
                cmp && cmp.setValidation(Ext.util.Format.format('Max File size is {0} MB', Math.round(maxFileSize / 1048576)));
            }
        },

        handleDownloadFile : function() {
            let vm = this.getViewModel(),
                attachmentId = vm.get('record.attachmentId');

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(API.EMPLOYEE_TIME_OFF_DOWNLOAD_ATTACHMENT, attachmentId)
            ));
        },

        onAfterSaveTimeoff : function(record, ids) {
            // upload attachment
            let me = this,
                view = this.getView(),
                documentField = this.lookup('document'),
                documentFieldInput = documentField.inputEl,
                timeOffIds = Ext.isArray(ids) ? ids : [ids];

            if (file && !documentField.disabled && timeOffIds && timeOffIds.length) {
                me._blockClose = true;
                view.setLoading(true);

                documentFieldInput.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([], {
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_UPLOAD_ATTACHMENT,
                    scope : me,
                    extraData : {
                        document : file,
                        timeOffIds : timeOffIds
                    },
                    success : me.afterSuccessUploadAttachment,
                    failure : me.afterFailureUploadAttachment,
                    owner : me,
                    initialWidth : documentFieldInput.getWidth()
                }, me.handleUploadProgress);

                documentFieldInput.setStyle('width', '1px');
            }
        },

        afterSuccessUploadAttachment : function() {
            let me = this,
                view = this.getView(),
                documentField = this.lookup('document'),
                documentFieldInput = documentField && documentField.inputEl;

            if (!view) {
                return;
            }

            view.setLoading(false);

            me._blockClose = false;
            file = null;

            if (documentField) {
                documentField.reset();
                documentFieldInput.setStyle('background-color', '#fff');
            }

            me.close();
        },

        afterFailureUploadAttachment : function() {
            let me = this,
                view = this.getView(),
                documentField = this.lookup('document'),
                documentFieldInput = documentField && documentField.inputEl;

            if (!view) {
                return;
            }

            view.setLoading(false);

            me._blockClose = false;
            file = null;

            if (documentField) {
                documentField.reset();
                documentFieldInput.setStyle('background-color', '#fff');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            let document = owner && owner.lookup('document');

            if (event.lengthComputable && document && document.inputEl) {
                document.inputEl.setWidth(parseInt(event.loaded / event.total * initialWidth, 10), true);
            }
        },

        onAfterRender : function() {
            let view = this.getView(),
                viewEl = view.getEl(),
                document = this.lookup('document');

            viewEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    viewEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (file) {
                        document.inputEl.dom.value = file.name;
                    }

                    viewEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    viewEl.removeCls('drag-over');
                }
            });
        },

        handleDurationBlur (cmp) {
            let hasError = false,
                parsed = criterion.Utils.timeStringToHoursMinutes(cmp.getValue()),
                hours = parsed.hours,
                minutes = parsed.minutes;

            if (!isNaN(hours) || !isNaN(minutes)) {
                this.getRecord().set('duration', (hours || 0) * 60 + (minutes || 0));
                cmp.setValue(criterion.Utils.timeObjToStr({
                    hours : hours,
                    minutes : minutes
                }));
            } else {
                hasError = true;
            }

            if (hasError) {
                cmp.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\''));
            }
        }
    }
});
