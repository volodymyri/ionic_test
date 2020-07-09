Ext.define('criterion.view.ess.Time', function() {

    return {

        alias : 'widget.criterion_selfservice_time',

        extend : 'criterion.ux.Panel',

        layout : {
            type : 'card',
            deferredRender : true
        },

        requires : [
            'criterion.controller.ess.Time',
            'criterion.view.employee.Timesheets',
            'criterion.view.ess.time.Availability',
            'criterion.view.ess.time.ShiftAssignments',
            'criterion.view.ess.time.AttendanceDashboard',
            'criterion.view.employee.timesheet.Dashboard',
            'criterion.view.ess.time.TimeOffDashboard',
            'criterion.view.ess.time.TeamTimeOffs'
        ],

        controller : {
            type : 'criterion_selfservice_time'
        },

        listeners : {
            activate : 'handleActivate'
        },

        viewModel : {},

        showHeaders : true,

        plugins : [
            {
                ptype : 'criterion_security_items'
            },
            {
                ptype : 'criterion_lazyitems',

                items : [
                    {
                        xtype : 'criterion_selfservice_time_time_off_dashboard',
                        itemId : 'timeOffDashboard',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_TIME_OFFS)
                    },
                    {
                        xtype : 'criterion_employee_timesheet_dashboard',
                        itemId : 'timesheetDashboard',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TIMESHEET)
                    },
                    {
                        xtype : 'criterion_employee_timesheets',
                        itemId : 'timesheets',
                        replaceTitle : true,
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TIMESHEET)
                    },
                    {
                        xtype : 'criterion_selfservice_time_availability',
                        itemId : 'availability',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_AVAILABILITY)
                    },
                    {
                        xtype : 'criterion_selfservice_time_availability',
                        itemId : 'availabilityManager',
                        title : i18n.gettext('Team Availability'),
                        viewModel : {
                            data : {
                                managerMode : true
                            }
                        },
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_AVAILABILITY)
                    },
                    {
                        xtype : 'criterion_selfservice_time_shift_assignments',
                        itemId : 'myShiftAssignments',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_SHIFT_ASSIGNMENTS)
                    },
                    {
                        xtype : 'criterion_selfservice_time_attendance_dashboard',
                        itemId : 'attendanceDashboard',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_ATTENDANCE)
                    },
                    {
                        xtype : 'criterion_selfservice_time_team_time_offs',
                        itemId : 'teamTimeOffs',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_TIME_OFFS)
                    }
                ]
            }
        ]
    };

});
