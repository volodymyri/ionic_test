Ext.define('criterion.view.scheduling.Settings', function() {

    return {
        alias : 'widget.criterion_scheduling_settings',

        extend : 'criterion.view.settings.Main',

        requires : [
            'criterion.view.scheduling.Toolbar'
        ],

        tbar : {
            xtype : 'criterion_scheduling_toolbar'
        }

    }
});
