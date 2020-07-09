Ext.define('criterion.view.settings.system.CustomLocalizations', function() {

    return {

        alias : 'widget.criterion_settings_system_custom_localizations',

        extend : 'criterion.view.settings.GridView',

        title : i18n.gettext('Custom Localization'),

        requires : [
            'criterion.view.settings.system.CustomLocalization',
            'criterion.store.CustomLocalizations'
        ],

        controller : {
            showTitleInConnectedViewMode : true,
            connectParentView : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_system_custom_localization',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        store : {
            type : 'criterion_custom_localizations'
        },

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'localizationLanguageCd',
                codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                text : i18n._('Language'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n._('Token'),
                dataIndex : 'token',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n._('Custom Localization'),
                dataIndex : 'label',
                flex : 2
            }
        ]

    };

});
