Ext.define('criterion.vm.timesheet.Vertical', function() {

    const ALL_WEEKS_NUMBER = 1000,
        TIMESHEET_LAYOUT_ENTRY_TYPE = criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE;

    return {

        extend : 'Ext.app.ViewModel',

        alias : 'viewmodel.criterion_timesheet_vertical',

        requires : [
            'criterion.model.employee.timesheet.Vertical',
            'criterion.store.employee.timesheet.vertical.TaskDetails',
            'criterion.store.CustomData',
            'criterion.store.employee.timesheet.Incomes',
            'criterion.store.employee.WorkLocations',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableAssignments',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.store.workLocation.Areas',
            'criterion.store.dashboard.subordinateTimesheet.Neighbors'
        ],

        data : {
            /**
             * Populated by VewController from remote data.
             * @type criterion.model.employee.timesheet.Vertical
             * @private
             */
            timesheetVertical : null,

            timesheetId : null,
            showExtraColumns : false,
            isStarted : false,
            viewDetailOnly : false,

            ALL_WEEKS_NUMBER : ALL_WEEKS_NUMBER,
            timesheetWeek : null,
            timesheetIdWeek : null,

            /**
             * Set in controller {@see criterion.controller.employee.timesheet.Vertical#prepareCustomFields}
             * Used as label AND show/hide flag.
             */
            customField1Title : '',
            customField2Title : '',
            customField3Title : '',
            customField4Title : '',

            // override for workflow view
            overrideHasMultiAssignments : false,
            overrideHasMultiLocations : false,

            //for manager view only
            options : {
                isCustomPeriod : false,
                payrollScheduleId : null,
                timesheetTypeId : null,
                payrollPeriodId : null,
                startDate : null,
                endDate : null,
                employeeGroupIds : [],
                isAggregateTimesheet : false,
                isFTE : false
            },
            optionDescription : {
                payrollSchedule : null,
                timesheetType : null,
                employeeGroups : null,
                startDate : null,
                endDate : null
            }
        },

        constructor : function(config) {
            config.stores = {
                taskDetails : {
                    type : 'criterion_employee_timesheet_vertical_task_details'
                },
                workLocations : {
                    type : 'criterion_employee_work_locations',
                    sorters : [{
                        property : 'employerLocationName',
                        direction : 'ASC'
                    }]
                },
                availableTasks : {
                    type : 'criterion_employee_timesheet_available_tasks',
                    filters : [
                        {
                            property : 'isActive',
                            value : true
                        }
                    ]
                },
                availableProjects : {
                    type : 'criterion_employee_timesheet_available_projects'
                },
                availableAssignments : {
                    type : 'criterion_employee_timesheet_available_assignments'
                },
                incomeCodes : {
                    type : 'criterion_employee_timesheet_available_incomes',
                    sorters : [{
                        property : 'name',
                        direction : 'ASC'
                    }]
                },
                workLocationAreas : {
                    type : 'work_location_areas'
                },
                timesheetNeighbors : {
                    type : 'criterion_dashboard_subordinate_timesheet_neighbors'
                },
                timesheetWeeks : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    sorters : [{
                        property : 'number',
                        direction : 'ASC'
                    }],
                    fields : [
                        {
                            name : 'number',
                            type : 'integer'
                        },
                        {
                            name : 'startDate',
                            type : 'date',
                            allowNull : true,
                            dateFormat : criterion.consts.Api.DATE_FORMAT
                        },
                        {
                            name : 'endDate',
                            type : 'date',
                            allowNull : true,
                            dateFormat : criterion.consts.Api.DATE_FORMAT
                        },
                        {
                            name : 'title',
                            type : 'string',
                            calculate : data => data.number === ALL_WEEKS_NUMBER ? i18n.gettext('Full date range') : Ext.String.format(
                                i18n.gettext('Week') + ' {0} ({1}) - {2} ({3})',
                                Ext.Date.format(data.startDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                                Ext.Date.format(data.startDate, 'D'),
                                Ext.Date.format(data.endDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                                Ext.Date.format(data.endDate, 'D')
                            )
                        }
                    ]
                }
            };

            config.formulas = {
                isStarted : data => !!data('timesheetVertical.startedTask'),

                inOutText : data => data('isStarted') ? Ext.util.Format.format('{0} ({1})', i18n.gettext('Out'), data('timesheetVertical.outButtonDescription') || i18n.gettext('Regular Hours')) : i18n.gettext('In'),

                inOutCls : data => data('isStarted') ? 'timesheet-out-button' : '',

                showSubmitTimesheet : data => data('timesheetVertical.id') > 0 && data('timesheetVertical.notSubmittedOrRejected'),

                canEditAction : data => data('timesheetVertical.notSubmittedOrRejected'),

                preventEditing : data => !data('canEditAction'),

                // for compatibility
                isEditable : data => data('canEditAction'),

                disableInOut : data => {
                    let disabled = data('isStarted') ? (!data('timesheetVertical.breakIsAbleToBeStopped') && data('timesheetVertical.hasStartedBreak')) : null;

                    return disabled || !data('timesheetVertical.notSubmittedOrRejected') || !data('timesheetVertical.isCurrent')
                },

                isOwnTimesheet : data => data('timesheetVertical.employeeId') === criterion.Api.getEmployeeId(),

                showInOutCol : data => {
                    let timesheetVertical = data('timesheetVertical'),
                        timesheetType = timesheetVertical && timesheetVertical.getTimesheetType && timesheetVertical.getTimesheetType();

                    return timesheetType && timesheetType.get('isShowTime') && (timesheetType.get('entryType') !== criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY)
                },

                showInOut : data => {
                    let timesheetVertical = data('timesheetVertical'),
                        timesheetType = timesheetVertical && timesheetVertical.getTimesheetType && timesheetVertical.getTimesheetType(),
                        entryType = timesheetType && timesheetType.get('entryType');

                    return data('isOwnTimesheet') && !data('viewDetailOnly') && (Ext.Array.contains([TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON, TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_AND_BUTTON], entryType))
                },

                isManualDay : data => data('timesheetVertical.timesheetType.entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY,

                totalLabel : data => data('isManualDay') ? i18n.gettext('Total Days:') : i18n.gettext('Total Hours:'),

                regularLabel : data => data('isManualDay') ? i18n.gettext('Regular Days:') : i18n.gettext('Regular Hours:'),

                totalValue : data => data('isManualDay') ? Ext.util.Format.employerAmountPrecision(data('timesheetVertical.totalDays')) : data('timesheetVertical.totalHours'),

                regularValue : data => data('isManualDay') ? Ext.util.Format.employerAmountPrecision(data('timesheetVertical.totalRegDays')) : data('timesheetVertical.totalRegHours'),

                overtimeValue : data => data('isManualDay') ? Ext.util.Format.employerAmountPrecision(data('timesheetVertical.totalOvertimeDays')) : data('timesheetVertical.totalOvertimeHours'),

                disableInput : data => data('isOwnTimesheet') && data('isButtonEntryType'),

                isButtonEntryType : data => {
                    let timesheetVertical = data('timesheetVertical'),
                        timesheetType = timesheetVertical && timesheetVertical.getTimesheetType && timesheetVertical.getTimesheetType();

                    return timesheetType ? (timesheetType.get('entryType') === TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON) : false;
                },

                hasMultiLocations : data => {
                    let workLocationsCount = data('workLocations.count'),
                        viewDetailOnly = data('viewDetailOnly'),
                        overrideHasMultiLocations = data('overrideHasMultiLocations');

                    if (viewDetailOnly && overrideHasMultiLocations) {
                        return true;
                    }

                    return workLocationsCount > 1;
                },

                hasMultiAssignments : data => {
                    let availableAssignmentsCount = data('availableAssignments.count'),
                        viewDetailOnly = data('viewDetailOnly'),
                        overrideHasMultiAssignments = data('overrideHasMultiAssignments');

                    if (viewDetailOnly && overrideHasMultiAssignments) {
                        return true;
                    }

                    return availableAssignmentsCount > 1;
                },

                getNotesIcon : data => {
                    let notes = data('timesheetVertical.notes');

                    return Ext.isModern ?
                        (Ext.isEmpty(data('timesheetVertical.notes')) ? 'md-icon-chat-bubble' : 'md-icon-chat')
                        :
                        (Ext.isEmpty(notes) ? criterion.consts.Glyph['chatbox'] : criterion.consts.Glyph['chatbox-working']);
                },

                allowRecallBtn : data => data('timesheetVertical.canRecall'),

                optionsTooltip : data => criterion.Utils.generateTipRow(i18n.gettext('Period'), data('optionDescription.periodName')) +
                    (data('options.period') === criterion.Consts.TIMESHEET_OPTION_PERIOD.PAY_PERIOD.value ? criterion.Utils.generateTipRow(i18n.gettext('Payroll Schedule'), data('optionDescription.payrollSchedule')) : '') +
                    criterion.Utils.generateTipRow(
                        i18n.gettext('Time period'), Ext.String.format('{0} - {1}',
                            Ext.Date.format(data('optionDescription.startDate'), criterion.consts.Api.SHOW_DATE_FORMAT),
                            Ext.Date.format(data('optionDescription.endDate'), criterion.consts.Api.SHOW_DATE_FORMAT))
                    ) +
                    criterion.Utils.generateTipRow(i18n.gettext('Timesheet Layout'), data('optionDescription.timesheetType')) +
                    criterion.Utils.generateTipRow(i18n.gettext('Employee Groups'), data('optionDescription.employeeGroupsFullText')),

                timesheetNeighborsIsEmpty : data => !data('timesheetNeighbors.count'),

                allowWeekSelector : data => data('timesheetVertical.timesheetType.frequencyCode') !== criterion.Consts.PAY_FREQUENCY_CODE.WEEKLY,

                isMonthly : data => data('timesheetVertical.timesheetType.frequencyCode') === criterion.Consts.PAY_FREQUENCY_CODE.MONTHLY
            };

            this.callParent(arguments);
        }

    }
});
