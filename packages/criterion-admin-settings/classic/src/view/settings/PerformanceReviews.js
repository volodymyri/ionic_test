Ext.define('criterion.view.settings.PerformanceReviews', function() {

    return {
        alias : 'widget.criterion_settings_performance_reviews',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.performanceReviews.*'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Performance Reviews'),

        items : [
            {
                xtype : 'criterion_settings_performance_reviews_rating_scales',
                reference : 'ratingScale'
            },
            {
                xtype : 'criterion_settings_performance_reviews_review_competencies',
                reference : 'reviewCompetency'
            },
            {
                xtype : 'criterion_settings_performance_reviews_review_templates',
                reference : 'reviewTemplate'
            },
            {
                xtype : 'criterion_settings_performance_reviews_review_periods',
                reference : 'reviewPeriod'
            }
        ]
    };

});
