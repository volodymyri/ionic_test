Ext.define('criterion.controller.settings.payroll.Schedules', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_payroll_settings_payroll_schedules',

        startEdit : function(record) {
            var resEditor = this.callParent(arguments);

            resEditor.fireEvent('recordLoaded', {
                record : record
            });

            return resEditor;
        }
    };
});

