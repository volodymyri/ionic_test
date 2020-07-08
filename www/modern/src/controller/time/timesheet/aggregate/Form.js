Ext.define('ess.controller.time.timesheet.aggregate.Form', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE,
        yearFrom = (new Date().getFullYear() - 1),
        yearTo = (new Date().getFullYear() + 1);

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_time_timesheet_aggregate_form',

        handlePainted : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                customdata = vm.get('customdata'),
                customDataContainer = view.down('#aggregateCustomDataContainer'),
                timesheetRecord = vm.get('timesheetRecord'),
                timesheetType = timesheetRecord.getTimesheetType(),
                isFTE = timesheetType && timesheetType.get('isFTE'),
                taskField = this.lookup('taskField');

            this.callParent(arguments);

            vm.set({
                isFTE : isFTE
            });

            customDataContainer.removeAll();

            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                var fieldName = Ext.String.format('customField{0}Id', index),
                    customField = timesheetType.get(fieldName) && customdata.getById(timesheetType.get(fieldName));

                if (!customField || customField.get('isHidden')) {
                    return;
                }

                var label = customField.get('label') || '',
                    dataTypeCd = customField.get('dataTypeCd'),
                    codeTableId = customField.get('codeTableId'),
                    codeTableCode,
                    dataType = criterion.CodeDataManager.getCodeDetailRecord('id', dataTypeCd, DICT.DATA_TYPE).get('code'),
                    field;

                vm.set('record.customValue' + index + 'Type', dataType);

                field = {
                    label : label,
                    labelWidth : 150,
                    isCustomField : true,
                    required : customField.get('isRequired'),
                    bind : {
                        readOnly : '{!timesheetRecord.notSubmittedOrRejected}',
                        value : '{record.customValue' + index + '}'
                    }
                };

                switch (dataType) {
                    default:
                    case DATA_TYPE.TEXT:
                        field = Ext.apply(field, {
                            xtype : 'textfield'
                        });

                        break;

                    case DATA_TYPE.NUMBER:
                        field = Ext.apply(field, {
                            xtype : 'numberfield'
                        });

                        break;

                    case DATA_TYPE.CURRENCY:
                        field = Ext.apply(field, {
                            xtype : 'criterion_field_currency_field'
                        });

                        break;

                    case DATA_TYPE.DATE:
                        field = Ext.apply(field, {
                            xtype : 'criterion_date_picker_field',
                            picker : {
                                yearFrom : yearFrom,
                                yearTo : yearTo
                            }
                        });

                        break;

                    case DATA_TYPE.CHECKBOX:
                        field = Ext.apply(field, {
                            xtype : 'criterion_combobox',
                            store : Ext.create('Ext.data.Store', {
                                fields : ['text', 'value'],
                                data : [
                                    {
                                        text : i18n.gettext('Yes'), value : 'true'
                                    },
                                    {
                                        text : i18n.gettext('No'), value : 'false'
                                    }
                                ]
                            }),
                            displayField : 'text',
                            valueField : 'value',
                            queryMode : 'local',
                            forceSelection : true,
                            autoSelect : true
                        });

                        break;

                    case DATA_TYPE.DROPDOWN:
                        codeTableCode = criterion.CodeDataManager.getCodeTableNameById(codeTableId);

                        field = Ext.apply(field, {
                            xtype : 'criterion_code_detail_select',
                            codeDataId : codeTableCode,
                            codeTableId : codeTableId,
                            autoSelect : false,
                            bind : Ext.apply({
                                readOnly : '{!timesheetRecord.notSubmittedOrRejected}',
                                value : '{record.customValue' + index + '}'
                            }, criterion.Utils.getCustomFieldBindFilters(customField, 'record', me, 'taskField'))
                        });

                        break;
                }

                customDataContainer.add(field);
            });

            if (record.phantom) {
                this.lookup('aggregatePaycodeField').reset();
                vm.set('selectedPaycode', null);

                if (!taskField.getValue()) {
                    if (!record.get('taskId')) {
                        var defaultValue = taskField.getStore().findRecord('defaultPercentage', 100);

                        if (defaultValue) {
                            taskField.setSelection(defaultValue);
                        }
                    }
                }
            }
        },

        setMainRecord : function() {
            var vm = this.getViewModel(),
                record = this.getRecord(),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments');

            if (workLocations.count() === 1) {
                record.set('employerWorkLocationId', workLocations.first().get('employerWorkLocationId'));
            }
            if (availableAssignments.count() === 1) {
                record.set('assignmentId', availableAssignments.first().get('assignmentId'));
            }
        },

        _checkFTE : function(isFTE, timesheetRecord, actionText) {
            var dfd = Ext.create('Ext.promise.Deferred');

            if (isFTE) {
                var timesheetTasks = timesheetRecord && timesheetRecord.timesheetTasks();

                if (timesheetTasks.sum('fte') > 1) {
                    criterion.Msg.confirm(
                        i18n.gettext('Warning'),
                        i18n.gettext('Total FTE exceeds 1.0.') + ' ' + actionText,
                        function(btn) {
                            if (btn === 'yes') {
                                dfd.resolve();
                            }
                        }
                    )
                } else {
                    dfd.resolve();
                }
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        handleSave : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                timesheetRecord = vm.get('timesheetRecord'),
                timesheetTasks = timesheetRecord.timesheetTasks(),
                isFTE = vm.get('isFTE');

            if (view.isValid()) {
                this._checkFTE(isFTE, timesheetRecord, i18n.gettext('Do you want to save this timesheet?')).then(function() {
                    view.setLoading(true);

                    timesheetTasks.each(taskDetail => {
                        if (taskDetail.get('paycodeChanged')) {
                            let replacedDetail = taskDetail.copy(null);

                            taskDetail.drop();

                            timesheetTasks.add(replacedDetail);
                        }
                    });

                    timesheetRecord.saveWithPromise().then({
                        scope : me,
                        success : function() {
                            view.fireEvent('save', timesheetRecord);
                            me.close();
                        }
                    }).always(function() {
                        view.setLoading(false);
                    })
                });
            }
        },

        close : function() {
            var view = this.getView(),
                menuBar = this.getMenuBar();

            menuBar && menuBar.defNavMode();
            view.fireEvent('close', this.getRecord());
        },

        deleteRecord : function() {
            var me = this,
                record = this.getRecord(),
                vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord');

            timesheet.timesheetTasks().remove(record);

            timesheet.saveWithPromise().then({
                scope : me,
                success : function() {
                    me.close();
                }
            });
        },

        handleCancel : function() {
            var me = this,
                record = this.getRecord(),
                view = this.getView(),
                vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord');

            if (Ext.isFunction(view.getFieldsAsArray)) {
                Ext.suspendLayouts();
                Ext.Array.each(view.getFieldsAsArray(), function(field) {
                    field.clearInvalid();
                });
                Ext.resumeLayouts(true);
            }

            if (record.phantom) {
                timesheet.timesheetTasks().remove(record);
            } else {
                record.reject();
            }

            me.close();
        }
    };
});
