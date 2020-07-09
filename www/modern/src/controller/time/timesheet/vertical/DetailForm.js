Ext.define('ess.controller.time.timesheet.vertical.DetailForm', function() {

    const DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE,
        currentYear = new Date().getFullYear(),
        yearFrom = (currentYear - 1),
        yearTo = (currentYear + 1);

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_time_timesheet_vertical_detail_form',

        requires : [
            'Ext.util.Geolocation'
        ],

        init : function() {
            this.callParent(arguments);

            this.initGeolocation();
        },

        initGeolocation : function() {
            this.geo = Ext.create('Ext.util.Geolocation', {
                autoUpdate : false
            });
        },

        handlePainted() {
            let me = this,
                taskField,
                vm = this.getViewModel(),
                record = vm.get('taskDetail'),
                container = this.lookup('verticalCustomData'),
                timesheet = vm.get('timesheet'),
                timesheetType = timesheet.getTimesheetType(),
                customdata = vm.get('customdata');

            if (record.phantom) {
                taskField = this.lookup('taskField');

                if (!taskField.getValue()) {
                    if (!record.get('taskId')) {
                        let defaultValue = taskField.getStore().findRecord('defaultPercentage', 100);

                        if (defaultValue) {
                            taskField.setSelection(defaultValue);
                        }
                    }
                }
            } else {
                // fill selectedPaycode
                vm.set('selectedPaycode', record.getPaycodeDetail());
            }

            container.removeAll();

            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                let fieldName = Ext.String.format('customField{0}Id', index),
                    customField = timesheetType.get(fieldName) && customdata.getById(timesheetType.get(fieldName));

                if (!customField || customField.get('isHidden')) {
                    return;
                }

                let label = customField.get('label') || '',
                    dataTypeCd = customField.get('dataTypeCd'),
                    codeTableId = customField.get('codeTableId'),
                    codeTableCode,
                    dataType = criterion.CodeDataManager.getCodeDetailRecord('id', dataTypeCd, DICT.DATA_TYPE).get('code'),
                    field;

                vm.set('taskDetail.customValue' + index + 'Type', dataType);

                field = {
                    label : label,
                    labelWidth : 150,
                    isCustomField : true,
                    required : customField.get('isRequired'),
                    bind : {
                        readOnly : '{preventEditing}',
                        value : '{taskDetail.customValue' + index + '}'
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
                            edgePicker : {
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
                                readOnly : '{preventEditing}',
                                value : '{taskDetail.customValue' + index + '}'
                            }, criterion.Utils.getCustomFieldBindFilters(customField, 'taskDetail', me, 'taskField'))
                        });

                        break;
                }

                container.add(field);
            });
        },

        getRecord() {
            return this.getViewModel().get('taskDetail');
        },

        handleSave : function() {
            let me = this,
                view = this.getView(),
                geoInfo = null;

            if (!view.isValid()) {
                return;
            }

            if (this.geo) {
                this.geo.updateLocation(function(geo) {
                    geoInfo = {
                        lat : geo !== null ? geo.getLatitude() : null,
                        lng : geo !== null ? geo.getLongitude() : null
                    };

                    me.saveInfo(geoInfo);
                });
            } else {
                me.saveInfo(geoInfo);
            }
        },

        saveInfo : function(geoInfo) {
            let me = this,
                view = this.getView(),
                taskDetail = this.getRecord(),
                time,
                hoursString,
                promises = [];

            view.setLoading(true);

            geoInfo && geoInfo.lat && taskDetail.set({lat : geoInfo.lat, lng : geoInfo.lng});

            hoursString = taskDetail.get('taskHoursString') || '0';
            time = criterion.Utils.hourStrParse(hoursString);

            taskDetail.set({
                hours : time.hours,
                minutes : time.minutes
            });
            taskDetail.calculateEndTime();

            if (taskDetail.get('paycodeChanged')) {
                let replacedTaskDetail = taskDetail.copy(null);

                replacedTaskDetail.setPaycodeDetail(taskDetail.getPaycodeDetail());

                taskDetail.drop();

                promises.push(
                    taskDetail.eraseWithPromise(),
                    replacedTaskDetail.saveWithPromise()
                );
            } else {
                promises.push(taskDetail.saveWithPromise());
            }

            Ext.promise.Promise.all(promises).then(function() {
                view.fireEvent('saved');
                criterion.Utils.toast(i18n.gettext('Saved.'));
                me.close();
            }).always(function() {
                view.setLoading(false);
            });
        }
    }
});
