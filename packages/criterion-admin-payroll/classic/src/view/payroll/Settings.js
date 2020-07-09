Ext.define('criterion.view.payroll.Settings', function() {

    return {
        alias : 'widget.criterion_payroll_settings',

        extend : 'criterion.view.settings.Main',

        requires: [
            'criterion.view.payroll.Toolbar'
        ],

        tbar : {
            xtype : 'criterion_payroll_toolbar'
        }
    }
});
