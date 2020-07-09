Ext.define('criterion.view.employee.timesheet.vertical.CheckIn', function() {

    return {

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.store.employee.timesheet.Incomes',
            'criterion.view.employee.timesheet.IncomeCombo',
            'criterion.model.employee.timesheet.Task',
            'criterion.model.CustomData'
        ],

        alias : 'widget.criterion_employee_timesheet_vertical_check_in',

        title : i18n.gettext('Check In'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 500,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        viewModel : {
            data : {
                timesheetRecord : null
            },
            formulas : {
                hasMultiLocations : data => data('workLocations.count') > 1,
                hasMultiAssignments : data => data('availableAssignments.count') > 1
            }
        },

        scrollable : 'vertical',

        alwaysOnTop : true,

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDE,

        items : [],

        initComponent : function() {
            this.buttons = [
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Cancel'),
                    ui : 'light',
                    handler : () => {
                        me.close();
                    }
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Check In'),
                    handler : () => {
                        me.timeEntryStart();
                    }
                }
            ];

            this.callParent(arguments);

            let me = this,
                vm = this.getViewModel(),
                incomeCodes = vm.get('incomeCodes'),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                timesheet = vm.get('timesheetRecord'),
                timesheetType = timesheet.getTimesheetType(),
                isEnterTimeoff = timesheetType && timesheetType.get('isEnterTimeoff'),
                isEnterHoliday = timesheetType && timesheetType.get('isEnterHoliday'),
                errors = [],
                timesheetTask,
                incomes = vm.get('incomeCodes'),
                incomeStore = Ext.create('criterion.store.employee.timesheet.Incomes', {
                    filters : [
                        function(income) {
                            let allowTimeOff = true,
                                allowHoliday = true;

                            if (income.get('paycode') === criterion.Consts.PAYCODE.TIME_OFF && !isEnterTimeoff) {
                                allowTimeOff = false;
                            }

                            if (income.get('paycode') === criterion.Consts.PAYCODE.HOLIDAY && !isEnterHoliday) {
                                allowHoliday = false;
                            }

                            return income && (income.get('hasAvailableDates') || income.get('isTrackableNow')) && allowTimeOff && allowHoliday;
                        }
                    ]
                }),
                customFields = timesheet.get('customFields'),
                workLocationAreasData = vm.get('workLocationAreas').getRange();

            incomes.cloneToStore(incomeStore);

            !incomeCodes.count() && errors.push(i18n.gettext('No Income Codes found.'));
            !workLocations.count() && errors.push(i18n.gettext('No Work Locations found.'));
            !availableAssignments.count() && errors.push(i18n.gettext('No Assignments found.'));

            if (errors.length) {
                criterion.Msg.error({
                    title : i18n.gettext('Error'),
                    message : errors.join('<br>'),
                    fn : () => {
                        me.close();
                    }
                });

                return;
            }

            let defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0),
                defaultIncome = incomeStore.findRecord('isDefault', true) || incomeStore.getAt(0),
                defaultIncomeIsTimeOff = defaultIncome && defaultIncome['isTimeOff'],
                defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0),
                defaultEmployerWorkLocationId = defaultWorkLocation.get('employerWorkLocationId'),
                items = [];

            timesheetTask = Ext.create('criterion.model.employee.timesheet.Task', {
                timesheetId : timesheet.getId(),
                paycodeDetail : defaultIncome.getData(),
                paycodeDetailId : defaultIncome.getId(),
                isTimeOff : defaultIncomeIsTimeOff,
                assignmentId : defaultAssignment.getId(),
                employerWorkLocationId : defaultEmployerWorkLocationId
            });

            vm.set('timesheetTask', timesheetTask);

            items.push(
                {
                    xtype : 'criterion_employee_timesheet_income_combo',
                    fieldLabel : i18n.gettext('Paycode'),
                    store : incomeStore,
                    bind : {
                        value : '{timesheetTask.paycodeDetailId}'
                    },
                    editable : true,
                    forceSelection : true,
                    listeners : {
                        change : function(cmp, value) {
                            let paycodeData = cmp.getStore().getById(value).getData();

                            timesheetTask.set({
                                paycodeDetail : paycodeData,
                                isTimeOff : paycodeData['isTimeOff']
                            });
                        }
                    }
                }
            );

            if (vm.get('timesheetRecord.timesheetType.isShowProject')) {
                items.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelProject') || i18n.gettext('Project'),
                        store : vm.getStore('availableProjects'),
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        editable : true,
                        forceSelection : true,
                        bind : {
                            value : '{timesheetTask.projectId}'
                        }
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowWorkLocation')) {
                items.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelWorkLocation') || i18n.gettext('Location'),
                        reference : 'workLocation',
                        store : workLocations,
                        queryMode : 'local',
                        valueField : 'employerWorkLocationId',
                        displayField : 'employerLocationName',
                        allowBlank : false,
                        hidden : true,
                        anyMatch : true,
                        editable : true,
                        forceSelection : true,
                        bind : {
                            hidden : '{!hasMultiLocations}',
                            value : '{timesheetTask.employerWorkLocationId}'
                        }
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowWorkArea')) {
                items.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelWorkArea') || i18n.gettext('Area'),
                        store : {
                            type : 'work_location_areas',
                            data : workLocationAreasData
                        },
                        editable : true,
                        forceSelection : true,
                        bind : {
                            value : '{timesheetTask.workLocationAreaId}',
                            filters : [
                                {
                                    property : 'workLocationId',
                                    value : '{timesheetTask.employerWorkLocationId}',
                                    exactMatch : true
                                }
                            ]
                        },
                        queryMode : 'local',
                        valueField : 'id',
                        displayField : 'name'
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowTasks')) {
                items.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelTask') || i18n.gettext('Task'),
                        store : vm.getStore('availableTasks'),
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        editable : true,
                        forceSelection : true,
                        bind : {
                            value : '{timesheetTask.taskId}',
                            filters : [
                                {
                                    property : 'projectId',
                                    value : '{timesheetTask.projectId}',
                                    exactMatch : true
                                },
                                {
                                    property : 'id', // for binding
                                    value : '{timesheetTask.workLocationAreaId}',
                                    disabled : true // this need
                                },
                                {
                                    filterFn : function(record) {
                                        let projectId = vm.get('timesheetTask.projectId'),
                                            workLocationAreaId = vm.get('timesheetTask.workLocationAreaId'),
                                            workLocationAreaIds = record.get('workLocationAreaIds');

                                        return projectId ? true : (
                                            !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                        );
                                    }
                                }
                            ]
                        }
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowAssignment')) {
                items.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelAssignment') || i18n.gettext('Assignment'),
                        store : availableAssignments,
                        valueField : 'id',
                        displayField : 'assignmentDetailTitle',
                        queryMode : 'local',
                        allowBlank : false,
                        hidden : true,
                        editable : true,
                        forceSelection : true,
                        bind : {
                            hidden : '{!hasMultiAssignments}',
                            value : '{timesheetTask.assignmentId}'
                        }
                    }
                );
            }

            Ext.Array.each(criterion.Utils.range(1, 4), index => {
                let customFieldConf = customFields[index - 1];

                if (customFieldConf) {
                    let customField = criterion.model.CustomData.loadData(customFieldConf),
                        fieldName = Ext.String.format('customValue{0}', index),
                        value = timesheetTask.get(fieldName),
                        cmp = Ext.merge({
                            fieldLabel : customField.get('label'),

                            listeners : {
                                change : function(cmp, value) {
                                    timesheetTask.set(fieldName, value)
                                }
                            },
                        }, criterion.Utils.getCustomFieldEditorConfig(customField, value, timesheetTask, fieldName));

                    items.push(cmp);
                }
            });

            this.add(items);
        },

        timeEntryStart : function() {
            let view = this,
                vm = this.getViewModel(),
                timesheetTask = vm.get('timesheetTask');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.TIME_ENTRY_START,
                method : 'POST',
                jsonData : timesheetTask.getData({
                    associated : true
                })
            }).then(() => {
                Ext.GlobalEvents.fireEvent('timeEntryInOut');
                view.setLoading(false);
                view.close();
            });
        }
    }
});
