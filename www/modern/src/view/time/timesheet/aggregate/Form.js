Ext.define('ess.view.time.timesheet.aggregate.Form', function() {

    return {

        alias : 'widget.criterion_time_timesheet_aggregate_form',

        extend : 'criterion.view.FormView',

        requires : [
            'ess.controller.time.timesheet.aggregate.Form',
            'ess.utils.timesheet.CommonHelpers'
        ],

        controller : {
            type : 'ess_modern_time_timesheet_aggregate_form'
        },

        viewModel : {
            data : {
                create : null,
                showActionPanel : false,
                selectedWorkLocation : null
            },
            formulas : {
                /**
                 * See CRITERION-5521 for details.
                 *
                 * @param data
                 * @returns {*}
                 */
                paycodeFallbackText : function(data) {
                    return data('isPhantom') ? '' : data('record.paycodeDetail.name');
                },

                taskFallbackText : function(data) {
                    return data('record.employeeTaskName');
                },

                isTaskDisabled : function(data) {
                    return data('record.isApplicableToApprover') === false;
                },

                isEditable : function(data) {
                    return data('timesheetRecord.notSubmittedOrRejected');
                },

                canDelete : function(data) {
                    return !data('isPhantom') && data('isEditable');
                },

                canChangePaycode : vmget => {
                    return vmget('isPhantom') || vmget('record.isIncome');
                }
            }
        },

        defaults : {
            labelWidth : 150
        },

        constructor : function(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'ess_modern_menubar',
                    docked : 'top',
                    title : i18n.gettext('Timesheet Detail'),
                    buttons : [
                        {
                            xtype : 'button',
                            iconCls : 'md-icon-clear',
                            handler : 'handleCancel'
                        }
                    ],
                    actions : []
                },

                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Paycode'),
                    bind : {
                        store : '{incomes}',
                        value : '{record.paycodeDetail.id}',
                        readOnly : '{!isEditable}',
                        disabled : '{!canChangePaycode}',
                        placeholder : '{paycodeFallbackText}'
                    },
                    name : 'paycode',
                    reference : 'aggregatePaycodeField',
                    valueField : 'id',
                    displayField : 'name',
                    autoSelect : false,
                    required : true,
                    listeners : {
                        change : function(cmp, value, oldValue) {
                            var taskVm = cmp.up('criterion_time_timesheet_aggregate_form').getViewModel(),
                                record = taskVm.get('record'),
                                selectedPaycode;

                            if (!value) {
                                if (oldValue) {
                                    cmp.setValue(oldValue);
                                }
                                return false;
                            }

                            if (!record.phantom && cmp.getSelection().getId() !== record.get('paycodeDetail').id) {
                                record.set('paycodeChanged', true);
                            }

                            selectedPaycode = taskVm.get('incomeCodes').getById(value);
                            selectedPaycode && record.set('paycodeDetail', selectedPaycode.getData());
                        }
                    },

                    beforeshowpicker : function(cmp) {
                        var record = cmp.up('criterion_time_timesheet_aggregate_form').getViewModel().get('record');

                        if (record.phantom || !record.get('isIncome')) {
                            return;
                        }

                        cmp.getStore().addFilter({
                            property : 'isIncome',
                            value : true,
                            id : 'incomesFilter'
                        });
                    },

                    hidepicker : function(cmp) {
                        cmp.getStore().removeFilter('incomesFilter');
                    }
                },
                {
                    xtype : 'criterion_combobox',
                    reference : 'employerLocationField',
                    label : i18n.gettext('Location'),
                    forceSelection : true,
                    hidden : true,
                    bind : {
                        valueNotFoundText : '{record.employerWorkLocationName}',
                        store : '{workLocations}',
                        value : '{record.employerWorkLocationId}',
                        readOnly : '{!isEditable}',
                        hidden : '{workLocations.count <= 1 && !timesheetRecord.timesheetType.isShowWorkLocation}',
                        selection : '{selectedWorkLocation}'
                    },
                    name : 'employerWorkLocationId',
                    valueField : 'employerWorkLocationId',
                    displayField : 'employerLocationName'
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Area'),
                    bind : {
                        valueNotFoundText : '{record.workLocationAreaName}',
                        store : '{workLocationAreas}',
                        value : '{record.workLocationAreaId}',
                        readOnly : '{!isEditable}',
                        hidden : '{workLocationAreas.count <= 1 && !timesheetRecord.timesheetType.isShowWorkArea}',
                        filters : [
                            {
                                property : 'workLocationId',
                                value : '{selectedWorkLocation.workLocationId}',
                                exactMatch : true
                            }
                        ]
                    },
                    displayField : 'name',
                    valueField : 'id',
                    autoSelect : false,
                    resetOnFilterChange : true
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Project'),
                    bind : {
                        valueNotFoundText : '{record.projectName}',
                        store : '{availableProjects}',
                        value : '{record.projectId}',
                        readOnly : '{!isEditable}',
                        hidden : '{!timesheetRecord.timesheetType.isShowProject}'
                    },
                    displayField : 'name',
                    valueField : 'id',
                    autoSelect : false
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Task'),
                    reference : 'taskField',
                    hidden : true,
                    bind : {
                        store : '{availableTasks}',
                        value : '{record.taskId}',
                        readOnly : '{!isEditable}',
                        hidden : '{!timesheetRecord.timesheetType.isShowTasks}',
                        valueNotFoundText : '{taskFallbackText}',
                        filters : [
                            {
                                property : 'projectId',
                                value : '{record.projectId}',
                                exactMatch : true
                            },
                            {
                                property : 'isActive',
                                value : true
                            },
                            {
                                property : 'id', // for binding
                                value : '{record.workLocationAreaId}',
                                disabled : true // this need
                            },
                            {
                                filterFn : function(record) {
                                    let rowVm = me.getViewModel(),
                                        projectId = rowVm.get('record.projectId'),
                                        workLocationAreaId = rowVm.get('record.workLocationAreaId'),
                                        workLocationAreaIds = record.get('workLocationAreaIds');

                                    return projectId ? true : (
                                        !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                    );
                                }
                            }
                        ]
                    },
                    name : 'taskId',
                    valueField : 'id',
                    displayField : 'name',
                    autoSelect : false,
                    resetOnFilterChange : true,
                    listeners : {
                        change : function(cmp, value) {
                            if (value) {
                                criterion.Utils.fillCustomFieldsDefaultValuesFromCodes(
                                    cmp.up('criterion_time_timesheet_aggregate_form'),
                                    cmp.getSelection().get('classificationCodesAndValues'),
                                    'criterion_code_detail_select[codeTableId=');
                            }
                        }
                    }
                },
                {
                    xtype : 'criterion_combobox',
                    reference : 'assignmentField',
                    label : i18n.gettext('Assignment'),
                    hidden : true,
                    bind : {
                        store : '{availableAssignments}',
                        value : '{record.assignmentId}',
                        readOnly : '{!isEditable}',
                        disabled : '{!isPhantom}',
                        hidden : '{availableAssignments.count <= 1 && !timesheetRecord.timesheetType.isShowAssignment}'
                    },
                    listeners : {
                        change : function(cmp, newVal, oldVal) {
                            if (!newVal) {
                                return false;
                            }

                            var vm = cmp.up('criterion_time_timesheet_aggregate_form').getViewModel(),
                                timesheetTask = vm.get('record'),
                                API = criterion.consts.Api.API;

                            if (newVal && (oldVal || timesheetTask.phantom)) {
                                criterion.Api.requestWithPromise({
                                    url : API.CALC_FTE_MULTIPLIER,
                                    method : 'GET',
                                    params : {
                                        assignmentId : newVal,
                                        timesheetId : timesheetTask.get('timesheetId')
                                    }
                                }).then(function(fteMultiplier) {
                                    timesheetTask.set('fteMultiplier', fteMultiplier)
                                });
                            }
                        }
                    },
                    name : 'assignmentId',
                    valueField : 'assignmentId',
                    displayField : 'title'
                },
                {
                    xtype : 'container',
                    id : 'aggregateCustomDataContainer',
                    items : []
                },

                {
                    xtype : 'numberfield',
                    label : i18n.gettext('FTE'),
                    name : 'fte',
                    hidden : true,
                    bind : {
                        readOnly : '{!isEditable}',
                        value : '{record.fte}',
                        hidden : '{!isFTE}',
                        disabled : '{!isFTE}'
                    }
                },
                {
                    xtype : 'numberfield',
                    label : i18n.gettext('Hours'),
                    bind : {
                        readOnly : '{!isEditable || (isEditable && isFTE)}',
                        value : '{record.totalHours}'
                    }
                },

                {
                    xtype : 'container',
                    layout : 'hbox',
                    margin : '10 20 10 20',
                    docked : 'bottom',
                    items : [
                        {
                            xtype : 'button',
                            ui : 'act-btn-delete',
                            handler : 'handleDelete',
                            text : i18n.gettext('Delete'),
                            hidden : true,
                            bind : {
                                hidden : '{!canDelete}'
                            },
                            margin : '0 5 0 0',
                            flex : 1
                        },

                        {
                            xtype : 'button',
                            ui : 'act-btn-save',
                            bind : {
                                hidden : '{!isEditable}'
                            },
                            handler : 'handleSave',
                            text : i18n.gettext('Save'),
                            margin : '0 0 0 5',
                            flex : 1
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }

    };
});
