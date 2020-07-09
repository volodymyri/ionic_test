Ext.define('criterion.view.settings.general.Video', function() {

    return {

        alias : 'widget.criterion_settings_general_video',

        extend : 'criterion.view.FormView',

        controller : {
            externalUpdate : false
        },

        title : i18n.gettext('Video'),

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
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Public'),
                name : 'isShare'
            }
        ]
    };

});
