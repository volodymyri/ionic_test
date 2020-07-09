Ext.define('criterion.vm.timesheet.Horizontal', function() {

    var WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'Ext.app.ViewModel',

        alias : 'viewmodel.criterion_timesheet_horizontal',

        requires : [
            'criterion.store.employee.WorkLocations',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.store.employee.timesheet.AvailableAssignments',
            'criterion.store.employee.timesheet.Incomes',
            'criterion.store.workLocation.Areas',
            'criterion.store.dashboard.subordinateTimesheet.Neighbors'
        ],

        data : {
            /**
             * @type criterion.model.employee.Timesheet
             */
            timesheetRecord : null,
            timesheetId : null,
            showDetails : false,
            isStarted : false,

            /**
             * Set in controller {@see criterion.controller.employee.timesheet.Horizontal#prepareCustomFields}
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

        formulas : {

            showDelete : function() {
                return false; // not allowed
            },

            showSubmitTimesheet : function(data) {
                return data('timesheetRecord.id') > 0
                    && (data('timesheetRecord.timesheetStatusCode') === WORKFLOW_STATUSES.NOT_SUBMITTED
                        || data('timesheetRecord.timesheetStatusCode') === WORKFLOW_STATUSES.REJECTED);
            },

            isEditable : function(data) {
                return (data('timesheetRecord.timesheetStatusCode') === WORKFLOW_STATUSES.NOT_SUBMITTED
                    || data('timesheetRecord.timesheetStatusCode') === WORKFLOW_STATUSES.REJECTED);
            },

            isOwnTimesheet : function(data) {
                return data('timesheetRecord.employeeId') === criterion.Api.getEmployeeId();
            },

            isManualDay : data => data('timesheetRecord.timesheetType.entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY,

            isButtonEntry : data => data('timesheetRecord.timesheetType.entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON,

            totalLabel : data => data('isManualDay') ? i18n.gettext('Total Days') : i18n.gettext('Total Hours'),

            totalValue : data => data('isManualDay') ? Ext.util.Format.employerAmountPrecision(data('timesheetRecord.totalDays')) : data('timesheetRecord.totalHours'),

            regularValue : data => data('isManualDay') ? Ext.util.Format.employerAmountPrecision(data('timesheetRecord.regDays')) : data('timesheetRecord.regHours'),

            overtimeValue : data => data('isManualDay') ? Ext.util.Format.employerAmountPrecision(data('timesheetRecord.overtimeDays')) : data('timesheetRecord.overtimeHours'),

            getNotesIcon : function(data) {
                var notes = data('timesheetRecord.notes');
                return Ext.isEmpty(notes) ? criterion.consts.Glyph['chatbox'] : criterion.consts.Glyph['chatbox-working'];
            },

            allowRecallBtn : function(data) {
                return data('timesheetRecord.canRecall');
            }
        },

        constructor : function(config) {
            config.stores = {
                workLocations : {
                    type : 'criterion_employee_work_locations'
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
                }
            };

            config.formulas = {
                hasMultiLocations : function(get) {
                    var workLocationsCount = get('workLocations.count'),
                        viewDetailOnly = get('viewDetailOnly'),
                        overrideHasMultiLocations = get('overrideHasMultiLocations');

                    if (viewDetailOnly && overrideHasMultiLocations) {
                        return true;
                    }

                    return workLocationsCount > 1;
                },

                hasMultiAssignments : function(get) {
                    var availableAssignmentsCount = get('availableAssignments.count'),
                        viewDetailOnly = get('viewDetailOnly'),
                        overrideHasMultiAssignments = get('overrideHasMultiAssignments');

                    if (viewDetailOnly && overrideHasMultiAssignments) {
                        return true;
                    }

                    return availableAssignmentsCount > 1;
                },

                optionsTooltip : function(data) {
                    return criterion.Utils.generateTipRow(i18n.gettext('Period'), data('optionDescription.periodName')) +
                        (data('options.period') === criterion.Consts.TIMESHEET_OPTION_PERIOD.PAY_PERIOD.value ? criterion.Utils.generateTipRow(i18n.gettext('Payroll Schedule'), data('optionDescription.payrollSchedule')) : '') +
                        criterion.Utils.generateTipRow(
                            i18n.gettext('Time period'), Ext.String.format('{0} - {1}',
                                Ext.Date.format(data('optionDescription.startDate'), criterion.consts.Api.SHOW_DATE_FORMAT),
                                Ext.Date.format(data('optionDescription.endDate'), criterion.consts.Api.SHOW_DATE_FORMAT))
                        ) +
                        criterion.Utils.generateTipRow(i18n.gettext('Timesheet Layout'), data('optionDescription.timesheetType')) +
                        criterion.Utils.generateTipRow(i18n.gettext('Employee Groups'), data('optionDescription.employeeGroupsFullText'));
                },

                timesheetNeighborsIsEmpty : data => {
                    return !data('timesheetNeighbors.count');
                }
            };

            this.callParent(arguments);
        }
    }
});
