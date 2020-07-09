Ext.define('criterion.view.settings.system.CustomLocalization', function() {

    return {

        alias : 'widget.criterion_settings_system_custom_localization',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.CustomLocalization'
        ],

        controller : {
            type : 'criterion_settings_system_custom_localization',
            externalUpdate : false
        },

        title : i18n._('Custom Localization'),

        allowDelete : true,

        bodyPadding : '25 10',

        items : [
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n._('Language'),
                name : 'localizationLanguageCd',
                codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                editable : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n._('Token'),
                name : 'token',
                allowBlank : false
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n._('Custom Localization'),
                name : 'label',
                flex : 1
            }
        ]
    };

});
