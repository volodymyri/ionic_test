Ext.define('criterion.vm.timesheet.Aggregate', function() {

    return {

        extend : 'Ext.app.ViewModel',

        alias : 'viewmodel.criterion_timesheet_aggregate',

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
             * @type criterion.model.employee.timesheet.Aggregate
             */
            timesheetRecord : null,
            timesheetId : null,
            showDetails : false,
            totalFTE : 0,

            isEditable : false,
            isOwnTimesheet : true,
            showSubmitTimesheet : false,

            /**
             * Set in controller {@see criterion.controller.employee.timesheet.Aggregate#prepareCustomFields}
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

        stores : {
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
            }
        },

        formulas : {
            hasMultiLocations : function(get) {
                let workLocationsCount = get('workLocations.count'),
                    viewDetailOnly = get('viewDetailOnly'),
                    overrideHasMultiLocations = get('overrideHasMultiLocations');

                if (viewDetailOnly && overrideHasMultiLocations) {
                    return true;
                }

                return workLocationsCount > 1;
            },

            hasMultiAssignments : function(get) {
                let availableAssignmentsCount = get('availableAssignments.count'),
                    viewDetailOnly = get('viewDetailOnly'),
                    overrideHasMultiAssignments = get('overrideHasMultiAssignments');

                if (viewDetailOnly && overrideHasMultiAssignments) {
                    return true;
                }

                return availableAssignmentsCount > 1;
            },

            getNotesIcon : function(get) {
                let notes = get('timesheetRecord.notes');
                return Ext.isEmpty(notes) ? criterion.consts.Glyph['chatbox'] : criterion.consts.Glyph['chatbox-working'];
            },

            totalTimeOffs : function(data) {
                let timeOffs = data('timesheetRecord.totals.timeOffs');

                return timeOffs && timeOffs.length ? Ext.Array.sum(Ext.Array.map(timeOffs, function(timeOff) {
                    return timeOff['value'] || 0;
                })) : 0;
            },

            allowRecallBtn : function(data) {
                return data('timesheetRecord.canRecall');
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
        }
    }
});
