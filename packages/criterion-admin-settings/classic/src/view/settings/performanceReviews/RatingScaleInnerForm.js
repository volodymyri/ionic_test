Ext.define('criterion.view.settings.performanceReviews.RatingScaleInnerForm', function() {

    return {

        requires : [
            'criterion.controller.settings.performanceReviews.RatingScaleInnerForm'
        ],

        alias : 'widget.criterion_settings_performance_reviews_rating_scale_inner_form',

        extend : 'criterion.view.FormView',

        controller : {
            type : 'criterion_settings_performance_reviews_rating_scale_inner_form'
        },

        title : i18n.gettext('Rating Scale'),

        defaults : {
            labelWidth : 200
        },

        items : [
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Rating'),
                name : 'rating',
                allowBlank : false,
                minValue : 0,
                listeners : {
                    change : 'handleRatingChange'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                reference : 'name',
                name : 'name',
                allowBlank : false
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Description'),
                reference : 'description',
                name : 'description',
                flex : 1
            }
        ]
    };

});
