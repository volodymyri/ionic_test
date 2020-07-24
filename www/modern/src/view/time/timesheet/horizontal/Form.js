Ext.define('ess.view.time.timesheet.horizontal.Form', function() {

    return {

        alias : 'widget.criterion_time_timesheet_horizontal_form',

        extend : 'criterion.view.FormView',

        requires : [
            'ess.controller.time.timesheet.horizontal.Form',
            'ess.utils.timesheet.CommonHelpers'
        ],

        controller : {
            type : 'ess_modern_time_timesheet_horizontal_form'
        },

        viewModel : {
            data : {
                create : null,
                showActionPanel : false,
                selectedWorkLocation : null
            },
            formulas : {

                canEdit : {
                    bind : {
                        bindTo : ['{create}', '{timesheetRecord}'],
                        deep : true
                    },
                    get : function(data) {
                        let create, timesheetRecord;

                        if (data && data.length) {
                            create = data[0];
                            timesheetRecord = data.length === 2 ? data[1] : null;
                        } else {
                            return false
                        }

                        let timesheetType = timesheetRecord && timesheetRecord.getTimesheetType && timesheetRecord.getTimesheetType(),
                            isButtonEntryType = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON),
                            isTrackable = this.get('record.paycodeDetail.isTrackable');

                        return isButtonEntryType ? !isTrackable : (create || timesheetRecord.get('canBeEdited'));
                    }
                },

                canSaveTask : {
                    bind : {
                        bindTo : ['{create}', '{timesheetRecord}'],
                        deep : true
                    },
                    get : function(data) {
                        let create, timesheetRecord;

                        if (data && data.length) {
                            create = data[0];
                            timesheetRecord = data.length === 2 ? data[1] : null;
                        } else {
                            return false
                        }

                        var timesheetType = timesheetRecord && timesheetRecord.getTimesheetType && timesheetRecord.getTimesheetType(),
                            disableManual = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON);

                        if (!timesheetRecord) {
                            return false
                        }

                        return (create && timesheetRecord.get('notSubmittedOrRejected')) || (!create && !disableManual)
                    }
                },

                hideSubmit : function() {
                    // this form without a submit action
                    return true;
                },

                hideSave : vmget => !vmget('timesheetRecord.notSubmittedOrRejected'),

                paycodeFallbackText : vmget => vmget('isPhantom') ? '' : vmget('record.paycodeDetail.name'),

                taskFallbackText : vmget => vmget('record.employeeTaskName'),

                canEditAndPaycodeIsActive : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        if (!record) {
                            return false
                        }

                        let paycodeDetail = record && record.get('paycodeDetail'),
                            incomeCodes = this.get('incomeCodes'),
                            canEdit = this.get('canEdit');

                        if (paycodeDetail) {
                            let actualPaycodeDetail = incomeCodes.getById(paycodeDetail.id);

                            if (actualPaycodeDetail) {
                                return canEdit && actualPaycodeDetail.isDateAvailable(record.get('date'))
                            } else {
                                return canEdit && paycodeDetail.isActive;
                            }
                        } else {
                            let selectedPaycode = this.get('selectedPaycode');

                            if (selectedPaycode) {
                                paycodeDetail = incomeCodes.getById(selectedPaycode.getId());
                            }

                            return !paycodeDetail ? canEdit : canEdit && paycodeDetail.isDateAvailable(record.get('date'));
                        }
                    }
                },

                canDelete : {
                    bind : {
                        bindTo : ['{create}', '{timesheetRecord}', '{record}'],
                        deep : true
                    },
                    get : function(data) {
                        var create, timesheetRecord, record;

                        if (data && data.length) {
                            create = data[0];
                            timesheetRecord = data[1] ? data[1] : null;
                            record = data[2] ? data[2] : null;
                        } else {
                            return false
                        }

                        var timesheetType = timesheetRecord && timesheetRecord.getTimesheetType && timesheetRecord.getTimesheetType(),
                            disableManual = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON);

                        if (!timesheetRecord || !record) {
                            return false
                        }

                        if (disableManual) {
                            return false
                        } else {
                            return !create
                                && !record.get('isApprovedTimeOff')
                                && timesheetRecord.get('notSubmittedOrRejected')
                        }
                    }
                },

                canChangePaycode : vmget => (vmget('isPhantom') || vmget('record.isIncome')) && vmget('canEditAndPaycodeIsActive')
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
                    bind : {
                        title : '<p class="two-lines one">{record.date:date("d M Y")}</p><p class="two-lines two">{record.date:date("l")}</p>'
                    },
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
                    xtype : 'component',
                    cls : 'timezone-info',
                    docked : 'top',
                    bind : {
                        html : '<i class="icon"></i><span class="text">{timezone}</span>'
                    }
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Paycode'),
                    readOnly : false,
                    disabled : false,
                    bind : {
                        store : '{incomeStore}',
                        value : '{record.paycodeRef}',
                        readOnly : '{!canSaveTask}',
                        disabled : '{!canChangePaycode}',
                        valueNotFoundText : '{paycodeFallbackText}'
                    },
                    name : 'paycode',
                    id : 'paycodeField',
                    valueField : 'id',
                    displayField : 'name',
                    autoSelect : false,
                    required : true,
                    listeners : {
                        change : function(cmp, value) {
                            if (!value) {
                                return false;
                            }

                            var taskVm = cmp.up('criterion_time_timesheet_horizontal_form').getViewModel(),
                                selectedPaycode = taskVm.get('incomeCodes').getById(value),
                                record = taskVm.get('record');

                            if (!record.phantom && value !== record.get('paycodeRef')) {
                                record.set('paycodeChanged', true);
                            }

                            taskVm.set('selectedPaycode', selectedPaycode);
                        },

                        beforeshowpicker : function(cmp) {
                            var record = cmp.up('criterion_time_timesheet_horizontal_form').getViewModel().get('record');

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
                        readOnly : '{!timesheetRecord.notSubmittedOrRejected}',
                        disabled : '{workLocations.count === 1}',
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
                        readOnly : '{preventEditing}',
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
                        readOnly : '{preventEditing}',
                        hidden : '{!timesheetRecord.timesheetType.isShowProject}'
                    },
                    displayField : 'name',
                    valueField : 'id',
                    autoSelect : false
                },
                {
                    xtype : 'criterion_combobox',
                    id : 'taskField',
                    label : i18n.gettext('Task'),
                    reference : 'taskField',
                    hidden : true,
                    bind : {
                        store : '{availableTasks}',
                        value : '{record.taskId}',
                        readOnly : '{!timesheetRecord.notSubmittedOrRejected}',
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
                                    cmp.up('criterion_time_timesheet_horizontal_form'),
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
                        readOnly : '{!timesheetRecord.notSubmittedOrRejected}',
                        disabled : '{!isPhantom || availableAssignments.count === 1}',
                        currentDate : '{record.date}',
                        hidden : '{availableAssignments.count <= 1 && !timesheetRecord.timesheetType.isShowAssignment}'
                    },
                    setCurrentDate : function(value) {
                        this.currentDate = value;
                    },
                    name : 'assignmentId',
                    valueField : 'assignmentId',
                    displayField : 'title',
                    listeners : {
                        beforeshowpicker : function(cmp) {
                            var store = cmp.getStore();

                            if (!store) {
                                return;
                            }

                            store.clearFilter();
                            store.filterBy(function(record) {
                                return record.isAvailableByDate(cmp.currentDate);
                            });
                        },
                        hidepicker : function(cmp) {
                            var store = cmp.getStore();
                            store && store.clearFilter();
                        }
                    }
                },
                {
                    xtype : 'container',
                    id : 'customDataContainer',
                    items : []
                },
                {
                    xtype : 'textfield',
                    label : i18n.gettext('Hours'),
                    bind : {
                        readOnly : '{!canEditAndPaycodeIsActive}',
                        value : '{record.formattedHours}',
                        hidden : '{selectedPaycode.isUnits}'
                    }
                },
                {
                    xtype : 'textfield',
                    label : i18n.gettext('Hours'),
                    name : 'units',
                    reference : 'unitField',
                    hidden : true,
                    readOnly : false,
                    bind : {
                        readOnly : '{!canEditAndPaycodeIsActive}',
                        value : '{record.units}',
                        hidden : '{!selectedPaycode.isUnits}'
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
                                hidden : '{!timesheetRecord.notSubmittedOrRejected}'
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



