Ext.define('criterion.view.settings.performanceReviews.RatingScales', function() {

    return {
        alias : 'widget.criterion_settings_performance_reviews_rating_scales',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.ReviewScales',
            'criterion.view.settings.performanceReviews.RatingScale'
        ],

        title : i18n.gettext('Rating Scales'),

        layout : 'fit',

        viewModel : {
            stores : {
                reviewScales : {
                    type : 'criterion_review_scales'
                }
            }
        },

        controller : {
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_settings_performance_reviews_rating_scale',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{reviewScales}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Scale Name'),
                flex : 3,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Rating Limit'),
                flex : 1,
                dataIndex : 'ratingLimit'
            }
        ]
    };

});
