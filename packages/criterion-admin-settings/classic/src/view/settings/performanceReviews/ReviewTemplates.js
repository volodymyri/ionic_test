Ext.define('criterion.view.settings.performanceReviews.ReviewTemplates', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_templates',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.ReviewTemplates',
            'criterion.view.settings.performanceReviews.ReviewTemplate',
            'criterion.controller.settings.performanceReviews.ReviewTemplates'
        ],

        title : i18n._('Review Template'),

        controller : {
            type : 'criterion_settings_performance_reviews_review_templates',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_performance_reviews_review_template',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_review_templates'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n._('Template Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n._('Groups'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'countGroups'
            },
            {
                xtype : 'gridcolumn',
                text : i18n._('Competencies'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'countCompetencies'
            },
            {
                xtype : 'booleancolumn',
                text : i18n._('Recruiting'),
                dataIndex : 'isRecruiting',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                encodeHtml : false,
                trueText : i18n._('Yes'),
                falseText : i18n._('No')
            },
            {
                xtype : 'booleancolumn',
                text : i18n._('Active'),
                dataIndex : 'isActive',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                encodeHtml : false,
                trueText : i18n._('Yes'),
                falseText : i18n._('No')
            }
        ]
    };

});
