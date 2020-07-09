Ext.define('criterion.view.recruiting.Settings', function() {

    return {
        alias : 'widget.criterion_recruiting_settings',

        extend : 'criterion.view.settings.Main',

        requires: [
            'criterion.view.recruiting.Toolbar'
        ],

        tbar : {
            xtype : 'criterion_recruiting_toolbar'
        }
    }
});
