Ext.define('criterion.view.settings.Recruiting', function() {

    return {
        alias : 'widget.criterion_settings_recruiting',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.recruiting.*'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Recruiting Administration'),

        items : [
            {
                xtype : 'criterion_settings_recruiting_publishing_sites',
                reference : 'publishing'
            },
            {
                xtype : 'criterion_settings_recruiting_question_sets',
                reference : 'questionSets'
            },
            {
                xtype : 'criterion_settings_recruiting_settings',
                reference : 'settings'
            }
        ]
    };

});
