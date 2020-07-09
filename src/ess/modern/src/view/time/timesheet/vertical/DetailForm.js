Ext.define('ess.view.time.timesheet.vertical.DetailForm', function() {

    return {

        extend : 'criterion.view.FormView',

        alias : 'widget.ess_modern_time_timesheet_vertical_detail_form',

        requires : [
            'criterion.vm.timesheet.vertical.Task',
            'ess.controller.time.timesheet.vertical.DetailForm'
        ],

        referenceHolder : true,

        defaults : {
            labelWidth : 150
        },

        controller : {
            type : 'ess_modern_time_timesheet_vertical_detail_form'
        },

        viewModel : {
            type : 'criterion_timesheet_vertical_task',

            data : {
                isApplicableToApprover : true,

                taskDetail : null,

                selectedWorkLocation : null
            },

            formulas : {
                isPhantom : {
                    bind : {
                        bindTo : '{taskDetail}',
                        deep : true
                    },
                    get : function(taskDetail) {
                        if (!taskDetail || !taskDetail.isModel) {
                            return false
                        }

                        return taskDetail.phantom;
                    }
                },

                _canEditTask : {
                    bind : {
                        bindTo : '{taskDetail}',
                        deep : true
                    },
                    get : function() {
                        let allowManualEntry = this.get('isButtonEntryType') ? (this.get('isPhantom') || !this.get('taskDetail.paycodeDetail.isTrackable')) : !this.get('disableInput');

                        return this.get('canEditAction') && this.get('taskDetail.isUpdatable') && allowManualEntry
                    }
                },

                hideInOut : {
                    bind : {
                        bindTo : '{selectedPaycode}',
                        deep : true
                    },
                    get : function(selectedPaycode) {
                        let timesheetVertical = this.get('timesheetVertical'),
                            timesheetType = timesheetVertical && timesheetVertical.getTimesheetType && timesheetVertical.getTimesheetType(),
                            isShowTime = timesheetType && timesheetType.get('isShowTime'),
                            isUnits = selectedPaycode && selectedPaycode.get('isUnits'),
                            isCompEarned = selectedPaycode && selectedPaycode.get('isCompEarned');

                        return isUnits || isCompEarned || !isShowTime;
                    }
                },

                /**
                 * See CRITERION-5521 for details.
                 *
                 * @param data
                 * @returns {*}
                 */
                paycodeFallbackText : function(data) {
                    return data('taskDetail.paycodeDetail.name')
                },

                taskFallbackText : function(data) {
                    return data('taskDetail.employeeTaskName')
                },

                canEditAndPaycodeIsActive : {
                    bind : {
                        bindTo : ['{selectedPaycode}', '{taskDetail}'],
                        deep : true
                    },
                    get : function() {
                        let taskDetail = this.get('taskDetail');

                        if (!taskDetail) {
                            return false
                        }

                        let paycodeDetail = taskDetail && (taskDetail.get('paycodeDetail') || taskDetail.getPaycodeDetail()),
                            incomeCodes = this.get('incomeCodes'),
                            canEdit = this.get('_canEditTask'),
                            actualPaycodeDetail,
                            selectedPaycode;

                        if (paycodeDetail) {
                            actualPaycodeDetail = incomeCodes.getById(paycodeDetail.id);

                            if (actualPaycodeDetail) {
                                return canEdit && actualPaycodeDetail.isDateAvailable(taskDetail.get('date'))
                            } else {
                                return canEdit && paycodeDetail.isActive;
                            }
                        } else {
                            selectedPaycode = this.get('selectedPaycode');

                            if (!selectedPaycode) {
                                return false;
                            }

                            paycodeDetail = incomeCodes.getById(selectedPaycode.getId());

                            if (!paycodeDetail) {
                                return canEdit
                            } else {
                                return canEdit && paycodeDetail.isDateAvailable(taskDetail.get('date'))
                            }
                        }
                    }
                },

                isApprovedTimeOff : {
                    bind : {
                        bindTo : '{taskDetail}',
                        deep : true
                    },
                    get : function(taskDetail) {
                        if (!taskDetail || !taskDetail.isModel) {
                            return false
                        }

                        return taskDetail.get('isApprovedTimeOff');
                    }
                }
            }
        },

        constructor : function(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'ess_modern_menubar',
                    docked : 'top',
                    bind : {
                        title : '<p class="two-lines one">{taskDetail.date:date("d M Y")}</p><p class="two-lines two">{taskDetail.date:date("l")}</p>'
                    },
                    buttons : [
                        {
                            xtype : 'button',
                            itemId : 'backButton',
                            cls : 'criterion-menubar-back-btn',
                            iconCls : 'md-icon-clear',
                            align : 'left',
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
                    bind : {
                        store : '{incomes}',
                        valueNotFoundText : '{paycodeFallbackText}',
                        value : '{taskDetail.paycodeDetail.id}',
                        readOnly : '{!canEditTask}',
                        disabled : '{disablePaycodeChange}'
                    },
                    displayField : 'name',
                    valueField : 'id',
                    autoSelect : false,
                    required : true,
                    listeners : {
                        change : function(cmp, value, oldValue) {
                            if (value === oldValue) {
                                return;
                            }

                            let taskVm = cmp.up('ess_modern_time_timesheet_vertical_detail_form').getViewModel(),
                                taskDetail = taskVm.get('taskDetail'),
                                selectedPaycode = taskVm.get('incomeCodes').getById(value),
                                paycodeDetail;

                            if (!selectedPaycode || !taskDetail) {
                                return;
                            }

                            paycodeDetail = taskDetail.getPaycodeDetail();

                            if (!taskDetail.phantom && value !== oldValue) {
                                taskDetail.set('paycodeChanged', true);
                            }

                            taskVm.set('selectedPaycode', selectedPaycode);
                            paycodeDetail.set(selectedPaycode.getData());
                        },

                        beforeshowpicker : function(cmp) {
                            let taskDetail = cmp.up('ess_modern_time_timesheet_vertical_detail_form').getViewModel().get('taskDetail');

                            if (!taskDetail || taskDetail.phantom || !taskDetail.getPaycodeDetail().get('isIncome')) {
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
                    label : i18n.gettext('Location'),
                    bind : {
                        valueNotFoundText : '{taskDetail.employerWorkLocationName}',
                        store : '{workLocations}',
                        value : '{taskDetail.employerWorkLocationId}',
                        readOnly : '{!canEditAnyEntryType}',
                        hidden : '{workLocations.count <= 1 && !timesheet.timesheetType.isShowWorkLocation}',
                        selection : '{selectedWorkLocation}'
                    },
                    displayField : 'employerLocationName',
                    valueField : 'employerWorkLocationId',
                    autoSelect : false
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Area'),
                    bind : {
                        valueNotFoundText : '{taskDetail.workLocationAreaName}',
                        store : '{workLocationAreas}',
                        value : '{taskDetail.workLocationAreaId}',
                        readOnly : '{!canEditAnyEntryType}',
                        hidden : '{workLocationAreas.count <= 1 && !timesheet.timesheetType.isShowWorkArea}',
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
                        valueNotFoundText : '{taskDetail.projectName}',
                        store : '{availableProjects}',
                        value : '{taskDetail.projectId}',
                        readOnly : '{!canEditAnyEntryType}',
                        hidden : '{!timesheet.timesheetType.isShowProject}'
                    },
                    displayField : 'name',
                    valueField : 'id',
                    autoSelect : false
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Task'),
                    reference : 'taskField',
                    bind : {
                        store : '{availableTasks}',
                        value : '{taskDetail.taskId}',
                        readOnly : '{!canEditAnyEntryType}',
                        hidden : '{!timesheet.timesheetType.isShowTasks}',
                        valueNotFoundText : '{taskFallbackText}',
                        filters : [
                            {
                                property : 'projectId',
                                value : '{taskDetail.projectId}',
                                exactMatch : true
                            },
                            {
                                property : 'isActive',
                                value : true
                            },
                            {
                                property : 'id', // for binding
                                value : '{taskDetail.workLocationAreaId}',
                                disabled : true // this need
                            },
                            {
                                filterFn : function(record) {
                                    let rowVm = me.getViewModel(),
                                        projectId = rowVm.get('taskDetail.projectId'),
                                        workLocationAreaId = rowVm.get('taskDetail.workLocationAreaId'),
                                        workLocationAreaIds = record.get('workLocationAreaIds');

                                    return projectId ? true : (
                                        !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                    );
                                }
                            }
                        ]
                    },
                    displayField : 'name',
                    valueField : 'id',
                    autoSelect : false,
                    resetOnFilterChange : true,
                    listeners : {
                        change : function(cmp, value) {
                            if (value) {
                                criterion.Utils.fillCustomFieldsDefaultValuesFromCodes(
                                    cmp.up('ess_modern_time_timesheet_vertical_detail_form'),
                                    cmp.getSelection().get('classificationCodesAndValues'),
                                    'criterion_code_detail_select[codeTableId='
                                );
                            }
                        }
                    }
                },
                {
                    xtype : 'criterion_combobox',
                    label : i18n.gettext('Assignment'),
                    bind : {
                        store : '{availableAssignments}',
                        value : '{taskDetail.assignmentId}',
                        readOnly : '{!canEditAnyEntryType}',
                        hidden : '{availableAssignments.count <= 1 && !timesheet.timesheetType.isShowAssignment}',
                        disabled : '{isApprovedTimeOff}',
                        currentDate : '{taskDetail.date}'
                    },
                    setCurrentDate : function(value) {
                        this.currentDate = value;
                    },

                    displayField : 'title',
                    valueField : 'assignmentId',
                    autoSelect : false,
                    listeners : {
                        beforeshowpicker : function(cmp) {
                            let store = cmp.getStore();

                            if (!store) {
                                return;
                            }

                            store.clearFilter();
                            store.filterBy(function(record) {
                                return record.isAvailableByDate(cmp.currentDate);
                            });
                        },
                        hidepicker : function(cmp) {
                            let store = cmp.getStore();

                            store && store.clearFilter();
                        }
                    }
                },

                {
                    xtype : 'container',
                    reference : 'verticalCustomData'
                },

                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    margin : '25 0 20 0',
                    items : [
                        {
                            xtype : 'criterion_timefield',
                            label : i18n.gettext('In'),
                            bind : {
                                readOnly : '{!canEditTask}',
                                disabled : '{isApprovedTimeOff || hideInOut || isStartedTask}',
                                value : '{taskDetail.startTime}',
                                hidden : '{hideInOut}',
                                increment : '{timesheetVertical.timesheetType.rounding}'
                            },
                            width : 160,
                            format : criterion.consts.Api.TIME_FORMAT
                        },
                        {
                            flex : 1
                        },
                        {
                            xtype : 'criterion_timefield',
                            label : i18n.gettext('Out'),
                            bind : {
                                readOnly : '{!canEditTask}',
                                disabled : '{isApprovedTimeOff || hideInOut || isStartedTask}',
                                value : '{taskDetail.endTime}',
                                hidden : '{hideInOut}',
                                increment : '{timesheetVertical.timesheetType.rounding}'
                            },
                            allowBlank : true,
                            width : 160,
                            format : criterion.consts.Api.TIME_FORMAT
                        }
                    ]
                },

                {
                    xtype : 'textfield',
                    label : i18n.gettext('Hours'),
                    bind : {
                        value : '{taskDetail.taskHoursString}',
                        hidden : '{selectedPaycode.isUnits}',
                        readOnly : '{!canEditAndPaycodeIsActive || !hideInOut}',
                        disabled : '{isApprovedTimeOff || selectedPaycode.isUnits}'
                    },
                    listeners : {
                        change : function(cmp, value) {
                            let taskDetail = this.up().getViewModel().get('taskDetail'),
                                parsed,
                                hours, minutes, hasError = false;

                            if (!taskDetail) {
                                return;
                            }

                            if (value.indexOf(':') !== -1) {
                                parsed = value.split(':');

                                hours = parseInt(parsed[0]);
                                minutes = parseInt(parsed[1]);

                            } else {
                                parsed = criterion.Utils.parseDuration(value, false);

                                hours = parsed.hours;
                                minutes = parsed.minutes;
                            }

                            if (!isNaN(hours) || !isNaN(minutes)) {
                                taskDetail.set({
                                    hours : isNaN(hours) ? 0 : parseInt(hours, 0),
                                    minutes : isNaN(minutes) ? 0 : parseInt(minutes, 0)
                                });

                                taskDetail.calculateEndTime();
                            } else {
                                hasError = true;
                            }

                            if (hasError) {
                                cmp.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\''));
                            }
                        }
                    }
                },
                {
                    xtype : 'textfield',
                    label : i18n.gettext('Hours'),
                    hidden : true,
                    bind : {
                        value : '{taskDetail.units}',
                        hidden : '{!selectedPaycode.isUnits}',
                        readOnly : '{!canEditAndPaycodeIsActive}'
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
                                hidden : '{isPhantom || !canEditAndPaycodeIsActive || isApprovedTimeOff || !taskDetail.isRemovable}'
                            },
                            margin : '0 5 0 0',
                            flex : 1
                        },

                        {
                            xtype : 'button',
                            ui : 'act-btn-save',
                            bind : {
                                hidden : '{!canEditAndPaycodeIsActive || isApprovedTimeOff}'
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

    }

});
