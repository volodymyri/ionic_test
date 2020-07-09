Ext.define('criterion.view.settings.recruiting.PublishingSites', function() {

    return {
        alias : 'widget.criterion_settings_recruiting_publishing_sites',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.PublishSites',
            'criterion.view.settings.recruiting.PublishingSite'
        ],

        title : i18n.gettext('Job Publishing Sites'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_recruiting_publishing_sites',
            showTitleInConnectedViewMode : true,
            editor : {
                xtype : 'criterion_settings_recruiting_publishing_site',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        listeners : {
            editorDestroy : 'onEditorDestroy'
        },

        store : {
            type : 'criterion_publish_sites'
        },

        tbar : false,

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Publishing Site'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'booleancolumn',
                align : 'center',
                text : i18n.gettext('Enabled'),
                dataIndex : 'isEnabled',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                trueText : '✓',
                falseText : ''
            },
            {
                xtype : 'booleancolumn',
                align : 'center',
                text : i18n.gettext('Default'),
                dataIndex : 'isDefault',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                trueText : '✓',
                falseText : ''
            }
        ]
    };

});
