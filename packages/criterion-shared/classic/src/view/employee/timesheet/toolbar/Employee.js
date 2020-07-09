//@deprecated

Ext.define('criterion.view.employee.timesheet.toolbar.Employee', {

    extend : 'Ext.toolbar.Toolbar',

    alias : 'widget.criterion_employee_timesheet_toolbar_employee',

    cls : 'toolbar-ess-employee',

    items : [
        {
            xtype : 'component',
            cls : 'criterion-team-member-name',
            hidden : true,
            bind : {
                html : '{timesheetRecord.personName} ({timesheetRecord.assignmentTitle})',
                hidden : '{isOwnTimesheet}'
            }
        },
        '->',
        {
            xtype : 'component',
            bind : {
                html : '{timesheetRecord.startDate:date()} &mdash; {timesheetRecord.endDate:date()} {timesheetRecord.timezoneDesc}'
            },
            style : {
                'font-weight' : 'bold'
            }
        }
    ]
});