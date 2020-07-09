Ext.define('criterion.view.settings.general.EssLink', function() {

    return {

        alias : 'widget.criterion_settings_general_ess_link',

        extend : 'criterion.view.FormView',

        controller : {
            externalUpdate : false
        },

        title : i18n.gettext('Link'),

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Description'),
                name : 'description',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('URL'),
                name : 'url',
                allowBlank : false
            }
        ]
    };

});