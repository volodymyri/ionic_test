Ext.define('criterion.view.employee.timesheet.horizontal.Dates', function() {

    return {

        extend : 'Ext.Container',

        alias : 'widget.criterion_employee_timesheet_horizontal_dates',

        requires : [
            'criterion.plugin.MouseOver'
        ],

        padding : '10 0 10 0',

        userCls : 'timesheet-horizontal-row',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.timesheet.Task
                 */
                timesheetTask : null
            },
            formulas : {
                isTaskEditable : function(vmget) {
                    return vmget('isEditable') && vmget('timesheetTask.isUpdatable') && !vmget('viewDetailOnly');
                },
                isTaskDisabled : function(vmget) {
                    return vmget('timesheetTask.isApplicableToApprover') === false || vmget('timesheetTask.isStarted');
                },
                nonUnitsAndManualDay : function(vmget) {
                    return !vmget('timesheetTask.isUnits') && vmget('isManualDay')
                },
                blockInputTime : function(vmget) {
                    let isTaskEditable = vmget('isTaskEditable');

                    if (vmget('timesheetTask.isHoliday')) {
                        return !isTaskEditable;
                    }

                    return !isTaskEditable || (vmget('isButtonEntry') && !this.get('managerMode'));
                },
                hideGeofence : function(vmget) {
                    return !this.get('isWorkflowView') && !this.get('managerMode');
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_mouse_over',
                delegate : '.days-container',
                highlightedCmps : ['.task-container']
            }
        ],

        layout : {
            type : 'hbox'
        },

        defaults : {
            margin : '0 10'
        },

        items : [
            // dynamic
        ],

        initComponent : function() {
            this.callParent(arguments);
            this.add(this.createColumns());
        },

        createColumns : function() {
            let vm = this.getViewModel(),
                columns = [],
                timesheetTask = vm.get('timesheetTask'),
                timesheet = vm.get('timesheetRecord'),
                taskDetails = timesheetTask.timesheetTaskDetails(),
                start = new Date(timesheet.get('startDate')),
                end = new Date(timesheet.get('endDate')),
                taskDetail;

            // eslint-disable-next-line no-unmodified-loop-condition
            for (let d = start, i = 1; d <= end; d.setDate(d.getDate() + 1), i++) {
                taskDetail = taskDetails.findRecord('date', new Date(d));

                if (!taskDetail) {
                    // fill gaps in task details
                    taskDetail = taskDetails.add({
                        timesheetTaskId : timesheetTask.getId(),
                        date : new Date(d)
                    })[0]
                }

                columns.push(this.createTaskDetailComponent(taskDetail));
            }

            return columns;
        },

        createTaskDetailComponent : function(taskDetail) {
            return {
                xtype : 'container',
                bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('dateCol', {}, -10),
                viewModel : {
                    data : {
                        internalTaskDetail : taskDetail
                    },
                    formulas : {
                        isAvailableAssignment : function(vmget) {
                            let internalTaskDetail = vmget('internalTaskDetail'),
                                assignmentId = vmget('timesheetTask.assignmentId'),
                                availableAssignments = vmget('availableAssignments'),
                                detailDate = internalTaskDetail && internalTaskDetail.get('date'),
                                selectedAssignmentIndex = availableAssignments.findBy(function(assignment) {
                                    return assignment.get('assignmentId') === assignmentId && assignment.isAvailableByDate(detailDate);
                                }),
                                selectedAssignment = availableAssignments.getAt(selectedAssignmentIndex),
                                isAvailable = selectedAssignment ? selectedAssignment.isAvailableByDate(detailDate) : false,
                                assignmentUnavailable = availableAssignments.find('assignmentId', assignmentId, 0, false, false, true) === -1;

                            if (!isAvailable && !assignmentUnavailable) {
                                internalTaskDetail.set({
                                    hours : 0,
                                    minutes : 0,
                                    days : 0,
                                    units : 0
                                });
                            }

                            return isAvailable;
                        },
                        hasGeofenceIn : function(vmget) {
                            return vmget('internalTaskDetail.isInsideGeofenceIn') !== undefined && vmget('internalTaskDetail.isInsideGeofenceIn') !== null;
                        },
                        hasGeofenceOut : function(vmget) {
                            return vmget('internalTaskDetail.isInsideGeofenceOut') !== undefined && vmget('internalTaskDetail.isInsideGeofenceOut') !== null;
                        },
                        geoFenceInTitle : function(vmget) {
                            return vmget('hasGeofenceIn') ?
                                (vmget('internalTaskDetail.isInsideGeofenceIn') ? i18n.gettext('Checked in inside geofence') : i18n.gettext('Checked in outside geofence')) :
                                i18n.gettext('No Data');
                        },
                        geoFenceInIconCls : function(vmget) {
                            return (vmget('internalTaskDetail.isInsideGeofenceIn') ? 'criterion-geolocation-inside' : 'criterion-geolocation-outside') +
                                (!vmget('hasGeofenceIn') ? ' disabled' : '');
                        },
                        geoFenceOutTitle : function(vmget) {
                            return vmget('hasGeofenceOut') ?
                                (vmget('internalTaskDetail.isInsideGeofenceOut') ? i18n.gettext('Checked out inside geofence') : i18n.gettext('Checked out outside geofence')) :
                                i18n.gettext('No Data');
                        },
                        geoFenceOutIconCls : function(vmget) {
                            return (vmget('internalTaskDetail.isInsideGeofenceOut') ? 'criterion-geolocation-inside' : 'criterion-geolocation-outside') +
                                (!vmget('hasGeofenceOut') ? ' disabled' : '');
                        }
                    }
                },
                defaults : {
                    width : 80,
                    margin : 0
                },
                layout : {
                    type : 'hbox'
                },
                items : [
                    {
                        xtype : 'numberfield',
                        hidden : true,
                        disabled : true,

                        ui : 'mini',

                        bind : {
                            value : '{internalTaskDetail.units}',
                            hidden : '{!timesheetTask.isUnits}',
                            readOnly : '{!isTaskEditable}',
                            disabled : '{isTaskDisabled || internalTaskDetail.isBlockedInCurrentPaycode || !isAvailableAssignment}'
                        }
                    },
                    {
                        xtype : 'numberfield',
                        hidden : true,
                        disabled : true,

                        ui : 'mini',

                        bind : {
                            value : '{internalTaskDetail.days}',
                            hidden : '{!nonUnitsAndManualDay}',
                            readOnly : '{!isTaskEditable}',
                            disabled : '{isTaskDisabled || internalTaskDetail.isBlockedInCurrentPaycode || !isAvailableAssignment}'
                        }
                    },
                    {
                        xtype : 'textfield',

                        msgTarget : 'qtip',

                        hidden : true,
                        disabled : true,

                        ui : 'mini',

                        bind : {
                            value : '{internalTaskDetail.time}',
                            hidden : '{timesheetTask.isUnits || isManualDay}',
                            readOnly : '{blockInputTime}',
                            disabled : '{isTaskDisabled || internalTaskDetail.isBlockedInCurrentPaycode || !isAvailableAssignment}'
                        },
                        listeners : {
                            blur : function(cmp) {
                                let parsed,
                                    hours,
                                    minutes,
                                    hasError = false,
                                    value = cmp.getValue();

                                if (value.search('d|h|m') > -1) {
                                    parsed = criterion.Utils.parseDuration(value, false, true);

                                    hours = parsed.hours;
                                    minutes = parsed.minutes;
                                } else if (value.indexOf(':') > -1) {
                                    parsed = value.split(':');

                                    hours = parseInt(parsed[0], 10);
                                    minutes = parseInt(parsed[1], 10);
                                } else {
                                    parsed = criterion.Utils.hoursToDuration(value);

                                    hours = parsed.hours;
                                    minutes = parsed.minutes;
                                }

                                if (!isNaN(hours) || !isNaN(minutes)) {
                                    taskDetail.set({
                                        hours : isNaN(hours) ? 0 : parseInt(hours, 10),
                                        minutes : isNaN(minutes) ? 0 : parseInt(minutes, 10)
                                    })
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
                        xtype : 'container',
                        padding : '0 5',
                        defaults : {
                            width : 20
                        },
                        items : [
                            {
                                xtype : 'button',
                                ui : 'glyph',
                                cls : 'criterion-btn-transparent',
                                glyph : criterion.consts.Glyph['android-pin'],
                                scale : 'small',
                                hidden : true,
                                bind : {
                                    hidden : '{!hasGeofenceIn && !hasGeofenceOut}',
                                    tooltip : '{geoFenceInTitle}',
                                    userCls : '{geoFenceInIconCls}'
                                }
                            },
                            {
                                xtype : 'button',
                                ui : 'glyph',
                                cls : 'criterion-btn-transparent',
                                glyph : criterion.consts.Glyph['android-pin'],
                                scale : 'small',
                                hidden : true,
                                bind : {
                                    hidden : '{!hasGeofenceOut && !hasGeofenceIn}',
                                    tooltip : '{geoFenceOutTitle}',
                                    userCls : '{geoFenceOutIconCls}'
                                }
                            }
                        ]
                    }
                ]
            };
        }
    }
});
