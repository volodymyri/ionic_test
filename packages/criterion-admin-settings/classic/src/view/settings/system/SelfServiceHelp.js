Ext.define('criterion.view.settings.system.SelfServiceHelp', {

    extend : 'criterion.view.settings.GridView',

    requires : [
        'criterion.store.EssHelp',
        'criterion.view.settings.system.SelfServiceHelpFrom'
    ],

    alias : 'widget.criterion_settings_system_ess_help',

    controller : {
        type : 'criterion_gridview',
        showTitleInConnectedViewMode : true,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_system_ess_help_form',
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    tbar : [
        '->',
        {
            xtype : 'button',
            reference : 'refreshButton',
            cls : 'criterion-btn-transparent',
            glyph : criterion.consts.Glyph['ios7-refresh-empty'],
            scale : 'medium',
            listeners : {
                click : 'handleRefreshClick'
            }
        }
    ],

    store : {
        type : 'criterion_ess_help'
    },

    title : i18n.gettext('Self Service Help'),

    columns : [
        {
            xtype : 'criterion_codedatacolumn',
            text : i18n.gettext('Page'),
            dataIndex : 'securityEssFunctionCd',
            codeDataId : criterion.consts.Dict.SECURITY_ESS_FUNCTION,
            width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Title'),
            dataIndex : 'title',
            flex : 1
        },
        {
            xtype : 'booleancolumn',
            dataIndex : 'isActive',
            text : i18n.gettext('Status'),
            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
            trueText : i18n.gettext('Active'),
            falseText : i18n.gettext('Inactive')
        }
    ]
});
