Ext.define('ess.view.time.TeamPunch', function() {

    return {
        alias : 'widget.ess_modern_time_team_punch',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.time.TeamPunch',
            'ess.view.time.teamPunch.*',
            'criterion.store.TimesheetTypes',
            'criterion.store.employer.payroll.Schedules',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',
            'criterion.store.EmployeeGroups',
            'criterion.store.dashboard.subordinateTimesheet.TeamPunch'
        ],

        title : 'Team Punch',

        viewModel : {
            data : {
                employeesSelected : 0,
                selectedEmployeeIds : []
            },
            stores : {
                timesheetTypes : {
                    type : 'criterion_timesheet_types',
                    filters : [
                        {
                            property : 'isManualDay',
                            value : false
                        }
                    ]
                },
                payrollSchedules : {
                    type : 'criterion_employer_payroll_schedules',
                    sorters : [
                        {
                            property : 'periodStartDate',
                            direction : 'ASC'
                        }
                    ]
                },
                payrollPeriods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods',
                    sorters : [
                        {
                            property : 'periodStartDate',
                            direction : 'ASC'
                        }
                    ]
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                },
                teamPunch : {
                    type : 'criterion_dashboard_subordinate_timesheet_team_punch'
                }
            }
        },

        listeners : {
            scope : 'controller',
            painted : 'load'
        },

        controller : {
            type : 'ess_modern_time_team_punch'
        },

        layout : 'card',

        items : [
            // filter form
            {
                xtype : 'ess_modern_time_team_punch_filter_form',
                reference : 'teamPunchFilterForm',
                listeners : {
                    showPunchParams : 'handleShowPunchParams'
                }
            },

            // punch form
            {
                xtype : 'ess_modern_time_team_punch_form',
                reference : 'teamPunchForm',
                listeners : {
                    back : 'handleBackToFilter',
                    showEmployees : 'handleShowEmployees',
                    executePunch : 'handleExecutePunch',
                    selectAllEmployees : 'handleSelectAllEmployees'
                }
            },

            // employees grid
            {
                xtype : 'ess_modern_time_team_punch_employees',
                reference : 'teamPunchEmployees',
                listeners : {
                    back : 'handleBackToForm',
                    executePunch : 'handleExecutePunch'
                }
            }
        ]
    };

});
