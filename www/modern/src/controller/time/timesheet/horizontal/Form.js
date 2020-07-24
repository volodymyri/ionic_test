Ext.define('ess.controller.time.timesheet.horizontal.Form', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE,
        yearFrom = (new Date().getFullYear() - 1),
        yearTo = (new Date().getFullYear() + 1),
        geo;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_time_timesheet_horizontal_form',

        requires : [
            'Ext.util.Geolocation',
            'criterion.store.employee.timesheet.LIncomes'
        ],

        listen : {
            global : {
                employeeTimezone : 'onEmployeeTimezoneUpdate'
            }
        },

        init : function() {
            this.callParent(arguments);

            this.initGeolocation();
        },

        initGeolocation : function() {
            geo = Ext.create('Ext.util.Geolocation', {
                autoUpdate : false
            });
        },

        onEmployeeTimezoneUpdate : function(timezoneCd, timezoneRec) {
            this.getViewModel().set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));
        },

        handlePainted : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                incomes = vm.get('incomes'),
                timesheet = vm.get('timesheetRecord'),
                timesheetType = timesheet.getTimesheetType(),
                isEnterTimeoff = timesheetType.get('isEnterTimeoff'),
                isEnterHoliday = timesheetType.get('isEnterHoliday'),
                incomeStore = Ext.create('criterion.store.employee.timesheet.LIncomes', {
                    filters : [
                        function(income) {
                            var allowTimeOff = true,
                                allowHoliday = true;

                            if (income.get('paycode') === criterion.Consts.PAYCODE.TIME_OFF && !isEnterTimeoff) {
                                allowTimeOff = false;
                            }

                            if (income.get('paycode') === criterion.Consts.PAYCODE.HOLIDAY && !isEnterHoliday) {
                                allowHoliday = false;
                            }

                            return income && allowTimeOff && allowHoliday;
                        }
                    ]
                }),
                customdata = vm.get('customdata'),
                customDataContainer = view.down('#customDataContainer');

            incomes.cloneToStore(incomeStore);

            this.callParent(arguments);

            vm.set('incomeStore', incomeStore);

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
                        readOnly : '{!canEditAnyEntryType}',
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
                                readOnly : '{!canEditAnyEntryType}',
                                value : '{record.customValue' + index + '}'
                            }, criterion.Utils.getCustomFieldBindFilters(customField, 'record', me, 'taskField'))
                        });

                        break;
                }

                customDataContainer.add(field);
            });

            if (record.phantom) {
                view.down('#paycodeField').reset();
                vm.set('selectedPaycode', null);

                var taskField = this.lookup('taskField');

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

        _saveTimesheetDetail : function(geoInfo) {
            var record = this.getRecord(),
                vm = this.getViewModel(),
                timesheetRecord = vm.get('timesheetRecord'),
                time = criterion.Utils.hourStrParse(record.get('formattedHours')),
                _selectedPaycode,
                selectedPaycode,
                dfd = Ext.create('Ext.promise.Deferred'),
                timesheetType = timesheetRecord && timesheetRecord.getTimesheetType && timesheetRecord.getTimesheetType(),
                isButtonEntryType = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON),
                timesheetId = timesheetRecord.get('id');

            record.set({
                hours : time.hours,
                minutes : time.minutes
            });

            if (record.phantom) {
                _selectedPaycode = vm.get('selectedPaycode');
                selectedPaycode = _selectedPaycode ? _selectedPaycode.getData() : null;

                if (!_selectedPaycode) {
                    criterion.Utils.toast(i18n.gettext('Please select paycode'));
                    dfd.reject();
                    return dfd.promise;
                }

                if (_selectedPaycode.get('isUnits') && !this.lookup('unitField').getValue()) {
                    // fill empty value as '0' instead ''
                    record.set('units', '0');
                }

                record.set({
                    paycode : selectedPaycode['paycode'],
                    entityRef : selectedPaycode['entityRef'],
                    paycodeDetail : selectedPaycode
                });

                record.getProxy().setExtraParams({
                    timesheetId : timesheetId
                });

                if (!isButtonEntryType && !record.get('isApprovedTimeOff')) {
                    geoInfo && geoInfo.lat && record.set({lat : geoInfo.lat, lng : geoInfo.lng});
                }

            }

            if (record.get('paycodeChanged')) {
                let replacedRecord = record.copy(null);

                replacedRecord.set({
                    startTime : null,
                    endTime : null
                });

                return record.eraseWithPromise().then(() => {
                    replacedRecord.saveWithPromise({
                        timesheetId : timesheetId
                    });
                });
            }

            return record.saveWithPromise();
        },

        saveInfo : function(geoInfo) {
            var me = this,
                view = this.getView(),
                record = this.getRecord();

            me._saveTimesheetDetail(geoInfo).then(function() {
                view.fireEvent('save', record);
                me.close();
            });
        },

        handleSave : function() {
            var me = this,
                view = this.getView(),
                geoInfo = null;

            if (view.isValid()) {
                if (geo) {
                    geo.updateLocation(function(geo) {
                        geoInfo = {
                            lat : geo !== null ? geo.getLatitude() : null,
                            lng : geo !== null ? geo.getLongitude() : null
                        };
                        me.saveInfo(geoInfo);
                    });
                } else {
                    me.saveInfo(geoInfo);
                }
            }
        },

        close : function() {
            var view = this.getView(),
                menuBar = this.getMenuBar();

            menuBar && menuBar.defNavMode();
            view.fireEvent('close', this.getRecord());
        }
    };
});
