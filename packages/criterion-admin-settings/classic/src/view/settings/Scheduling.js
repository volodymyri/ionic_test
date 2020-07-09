Ext.define('criterion.view.settings.Scheduling', function() {

    return {
        alias : 'widget.criterion_settings_scheduling',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.scheduling.*'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Scheduling Administration'),

        items : [
            {
                xtype : 'criterion_settings_scheduling_required_coverages',
                reference : 'requiredCoverage'
            }
        ]
    };

});
