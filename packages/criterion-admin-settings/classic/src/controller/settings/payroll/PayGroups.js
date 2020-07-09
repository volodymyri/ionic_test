Ext.define('criterion.controller.settings.payroll.PayGroups', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_pay_groups',

        startEdit : function(record) {
            var resEditor = this.callParent(arguments);

            resEditor.fireEvent('recordLoaded', {
                record : record
            });

            return resEditor;
        }

    };

});
