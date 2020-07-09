Ext.define('criterion.controller.settings.payroll.timesheetLayout.BreakConfiguration', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_timesheet_layout_break_configuration',

        requires : [
            'criterion.view.settings.payroll.timesheetLayout.BreakConfigurationForm'
        ],

        editor : {
            xtype : 'criterion_settings_timesheet_layout_break_configuration_form',
            allowDelete : true
        },

        connectParentView : false,

        getEmptyRecord : function() {
            var parentRecord = this.getViewModel().get('record');
            return {
                timesheetTypeId : parentRecord && parentRecord.getId()
            }
        }
    }
});
