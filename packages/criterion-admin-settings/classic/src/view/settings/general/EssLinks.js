Ext.define('criterion.view.settings.general.EssLinks', function() {

    return {
        alias : 'widget.criterion_settings_ess_links',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.EssLinks',
            'criterion.view.settings.general.EssLink',
            'criterion.controller.settings.general.EssLinks'
        ],

        title : i18n.gettext('Self Service Links'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_ess_links',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_general_ess_link',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                        height : 'auto'
                    }
                ],
                draggable : true
            }
        },

        store : {
            type : 'criterion_employer_ess_links'
        },

        listeners : {
            viewaction : 'handleOpenLink'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                flex : 1,
                dataIndex : 'description'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('URL'),
                flex : 1,
                dataIndex : 'url'
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['android-open'],
                        tooltip : i18n.gettext('Open Link'),
                        action : 'viewaction'
                    }
                ]
            }
        ]
    };

});
