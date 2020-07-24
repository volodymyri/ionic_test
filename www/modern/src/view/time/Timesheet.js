Ext.define('ess.view.time.Timesheet', function() {

    return {
        alias : 'widget.ess_modern_time_timesheet',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.time.Timesheet',
            'ess.view.time.timesheet.*',
            'criterion.store.employee.Timesheets',
            'criterion.store.CustomData'
        ],

        title : 'Timesheet',

        viewModel : {
            stores : {
                employeeTimesheets : {
                    type : 'criterion_employee_timesheets',
                    sorters : [{
                        property : 'startDate',
                        direction : 'DESC'
                    }],
                    proxy : {
                        extraParams : {
                            employeeId : '{employeeId}'
                        }
                    }
                },
                customdata : {
                    type : 'criterion_customdata',
                    sorters : [{
                        property : 'sequenceNumber',
                        direction : 'ASC'
                    }]
                }
            }
        },

        listeners : {
            scope : 'controller',
            painted : 'load',
            activate : 'onActivate'
        },

        controller : {
            type : 'ess_modern_time_timesheet'
        },

        layout : 'card',

        items : [
            // list
            {
                xtype : 'ess_modern_time_timesheet_list',
                id : 'timesheetsList'
            },

            // horizontal (old non-hourly)
            {
                xtype : 'ess_modern_time_timesheet_horizontal',
                id : 'timesheetsHorizontalGrid',
                hidden : true,
                listeners : {
                    back : 'handleBack'
                }
            },

            // verticals (old hourly)
            {
                xtype : 'ess_modern_time_timesheet_vertical',
                id : 'timesheetsVerticalGrid',
                hidden : true,
                listeners : {
                    back : 'handleBack'
                }
            },

            // aggregate (readonly mode)
            {
                xtype : 'ess_modern_time_timesheet_aggregate',
                id : 'timesheetsAggregateGrid',
                hidden : true,
                listeners : {
                    back : 'handleBack'
                }
            }
        ]
    };

});
