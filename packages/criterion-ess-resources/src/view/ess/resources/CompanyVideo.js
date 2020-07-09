Ext.define('criterion.view.ess.resources.CompanyVideos', function() {

    return {
        alias : 'widget.criterion_selfservice_resources_company_videos',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.Videos',
            'criterion.controller.ess.resources.CompanyVideos'
        ],

        controller : {
            type : 'criterion_selfservice_resources_company_videos'
        },

        store : {
            type : 'criterion_employer_videos'
        },

        listeners : {
            viewaction : 'handleVideoView'
        },

        header : {

            title : i18n.gettext('Company Videos'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        tbar : null,

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
                        glyph : criterion.consts.Glyph['ios7-film-outline'],
                        tooltip : i18n.gettext('Play'),
                        action : 'viewaction'
                    }
                ]
            }
        ]
    };

});
