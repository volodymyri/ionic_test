Ext.define('criterion.view.settings.general.Videos', function() {

    return {
        alias : 'widget.criterion_settings_general_videos',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.Videos',
            'criterion.view.settings.general.Video',
            'criterion.controller.settings.general.Videos'
        ],

        title : i18n.gettext('Videos'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_videos',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_general_video',
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
            type : 'criterion_employer_videos'
        },

        listeners : {
            viewaction : 'handleVideoView'
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
                xtype : 'gridcolumn',
                dataIndex : 'isShare',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                encodeHtml : false,
                renderer : function(value) {
                    return ' <span style="font-family:Ionicons">'
                        + '&#' + criterion.consts.Glyph[value ? 'ios7-person-outline' : 'ios7-locked-outline']
                        + '</span>';
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-film-outline'],
                        tooltip : i18n.gettext('Play'),
                        action : 'viewaction'
                    }
                ]
            }
        ]
    };

});

