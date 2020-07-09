Ext.define('criterion.view.hr.Settings', function() {

    return {
        alias : 'widget.criterion_hr_settings',

        extend : 'criterion.view.settings.Main',

        requires: [
            'criterion.view.hr.Toolbar'
        ],

        tbar : {
            xtype : 'criterion_hr_toolbar'
        }

    }
});
