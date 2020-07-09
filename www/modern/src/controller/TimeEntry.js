Ext.define('ess.controller.TimeEntry', function() {

    let geo;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_entry',

        requires : [
            'Ext.util.Geolocation',
            'criterion.model.employee.timesheet.Task'
        ],

        init : function() {
            this.callParent(arguments);

            this.initGeolocation();
        },

        initGeolocation : function() {
            geo = Ext.create('Ext.util.Geolocation', {
                autoUpdate : false
            });
        },

        load : function() {
            let vm = this.getViewModel(),
                employeeWorkLocations = vm.getStore('employeeWorkLocations'),
                workLocationAreas = vm.getStore('workLocationAreas'),
                availableTasks = vm.getStore('availableTasks'),
                assignments = vm.getStore('assignments'),
                employeePaycodes = vm.getStore('employeePaycodes'),
                availableProjects = vm.getStore('availableProjects'),
                customFields = this.lookup('customFields'),
                startData = vm.get('startData'),
                DATA_TYPE = criterion.Consts.DATA_TYPE,
                startedTask,
                defaultAssignment,
                defaultIncome,
                defaultWorkLocation,
                availablePaycodes = [];

            employeeWorkLocations.loadData(startData.employeeWorkLocations);
            availableTasks.loadData(startData.availableTasks);
            assignments.loadData(startData.assignments);
            workLocationAreas.loadData(startData.workLocationAreas);
            availableProjects.loadData(startData.availableProjects);

            if (startData.employeePaycodes) {
                employeePaycodes.loadRawData(startData.employeePaycodes);

                employeePaycodes.each(function(paycode) {
                    if (paycode.get('isTrackableNow')) {
                        availablePaycodes.push(paycode);
                    }
                });
            }

            employeePaycodes.loadData(availablePaycodes);

            defaultAssignment = assignments.findRecord('isPrimary', true) || assignments.getAt(0);
            defaultIncome = employeePaycodes.findRecord('isDefault', true) || employeePaycodes.getAt(0);
            defaultWorkLocation = employeeWorkLocations.findRecord('isPrimary', true) || employeeWorkLocations.getAt(0);

            if (!startData.startedTask) {
                startedTask = Ext.create('criterion.model.employee.timesheet.Task', {
                    paycodeDetail : defaultIncome ? defaultIncome.getData() : null,
                    paycodeDetailId : defaultIncome ? defaultIncome.getId() : null,
                    assignmentId : defaultAssignment.getId(),
                    employerWorkLocationId : defaultWorkLocation.get('employerWorkLocationId'),
                    taskId : null
                });
            } else {
                startedTask = Ext.create('criterion.model.employee.timesheet.Task', startData.startedTask);
                startedTask.setPaycodeDetail(employeePaycodes.getById(startData.startedTask.paycodeDetailId));
            }

            customFields.removeAll();

            Ext.Array.each(startData.customData, function(customDataField) {
                let field = {
                    label : customDataField.name,
                    bind : {
                        value : '{startedTask.customValue' + customDataField.customFieldId + '}',
                        disabled : '{startedTask.isStarted}'
                    }
                };

                switch (customDataField.type) {
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
                            xtype : 'criterion_date_picker_field'
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
                        field = Ext.apply(field, {
                            xtype : 'criterion_code_detail_select',
                            label : customDataField.name,
                            codeTableId : customDataField.codeTableId,
                            store : Ext.create('Ext.data.Store', {
                                proxy : 'memory',
                                model : 'criterion.model.codeTable.Detail',
                                data : customDataField.data
                            }),
                            bind : Ext.apply({
                                value : '{startedTask.customValue' + customDataField.customFieldId + '}',
                                disabled : '{startedTask.isStarted}'
                            }, criterion.Utils.getCustomFieldBindFilters(Ext.create('criterion.model.CustomData', Ext.clone(customDataField)), 'startedTask', vm, 'taskField')),
                            valueField : 'id',
                            displayField : 'description',
                            autoSelect : false
                        });

                        break;
                    default:
                        field = Ext.apply(field, {
                            xtype : 'textfield'
                        });
                }

                customFields.add(field);
            });

            vm.set({
                startedTask : startedTask,
                labelAssignment : startData.labelAssignment || i18n.gettext('Title'),
                labelTask : startData.labelTask || i18n.gettext('Task'),
                labelWorkArea : startData.labelWorkArea || i18n.gettext('Area'),
                labelWorkLocation : startData.labelWorkLocation || i18n.gettext('Location'),
                labelProject : startData.labelProject || i18n.gettext('Project'),

                isShowWorkLocation : startData.isShowWorkLocation || employeeWorkLocations.count() > 1,
                isShowAssignment : startData.isShowAssignment || assignments.count() > 1,
                isShowWorkArea : startData.isShowWorkArea,
                isShowTasks : startData.isShowTasks,
                isShowProject : startData.isShowProject
            });
        },

        handleSelectPaycode : function(cmp, newValue, oldValue) {
            let selection = cmp.getSelection(),
                startedTask = this.getViewModel().get('startedTask');

            selection && startedTask.setPaycodeDetail(selection);
        },

        handleInOutClick : function() {
            let me = this,
                view = me.getView(),
                entryForm = me.lookup('entryForm'),
                hasInvalid = false, geoInfo = {};

            Ext.Array.each(entryForm.query('[required=true]'), function(requiredField) {
                if (!requiredField.getValue()) {
                    hasInvalid = true;
                    return false;
                }
            });

            if (hasInvalid) {
                criterion.Utils.toast(i18n.gettext('Please set required fields.'));
                return
            }

            view.setLoading(true); // geo loading takes time and user can click twice

            if (geo) {
                geo.updateLocation(function(geo) {
                    geoInfo = {
                        lat : geo !== null ? geo.getLatitude() : null,
                        lng : geo !== null ? geo.getLongitude() : null
                    };
                    me.updateInfo(geoInfo);
                });
            } else {
                me.updateInfo(geoInfo);
            }
        },

        updateInfo : function(geoInfo) {
            let me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                startedTask = vm.get('startedTask'),
                attestationMessage = vm.get('startData.attestationMessage'),
                isStarted = startedTask && startedTask.get('isStarted');

            if (isStarted && attestationMessage) {
                Ext.Msg.show({
                    ui : 'rounded',
                    title : i18n.gettext('Message'),
                    message : attestationMessage,
                    buttons : [
                        {
                            text : i18n.gettext('Cancel'),
                            itemId : 'no',
                            cls : 'cancel-btn'
                        },
                        {
                            text : i18n.gettext('Ok'),
                            itemId : 'yes'
                        }
                    ],
                    prompt : false,
                    scope : this,
                    fn : function(btn) {
                        if (btn === 'yes') {
                            me.actInOut(geoInfo);
                        } else {
                            view.setLoading(false);
                        }
                    }
                });
            } else {
                me.actInOut(geoInfo);
            }
        },

        actInOut(geoInfo) {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                startedTask = vm.get('startedTask'),
                isStarted = startedTask && startedTask.get('isStarted');

            criterion.Api.requestWithPromise({
                url : isStarted ? criterion.consts.Api.API.TIME_ENTRY_STOP : criterion.consts.Api.API.TIME_ENTRY_START,
                method : isStarted ? 'PUT' : 'POST',
                jsonData : Ext.apply(geoInfo || {}, !isStarted ? startedTask.getData({
                    serialized : true,
                    associated : true
                }) : {
                    employerWorkLocationId : startedTask.get('employerWorkLocationId')
                })
            }).then(function(response) {
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.TIME_ENTRY_START_DATA,
                    method : 'GET'
                }).then(function(startData) {
                    vm.set('startData', startData);
                    me.load();
                }).always(function() {
                    view.setLoading(false);
                });
            }).otherwise(function() {
                view.setLoading(false);
            })
        }
    };
});
