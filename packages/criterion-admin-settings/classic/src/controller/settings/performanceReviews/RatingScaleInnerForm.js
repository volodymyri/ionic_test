Ext.define('criterion.controller.settings.performanceReviews.RatingScaleInnerForm', function() {

    var NOT_APPLICABLE = i18n.gettext('Not Applicable');

    return {
        alias : 'controller.criterion_settings_performance_reviews_rating_scale_inner_form',

        extend : 'criterion.controller.FormView',

        handleRatingChange : function(rating, ratingValue, ratingPrevValue) {
            var me = this,
                name = me.lookup('name'),
                description = me.lookup('description'),
                notApplicable = ratingValue === criterion.Consts.REVIEW_SCALE_RATING.NOT_APPLICABLE;

            if (notApplicable) {
                name.setValue(NOT_APPLICABLE);
                description.setValue(NOT_APPLICABLE);
            } else if (ratingPrevValue === criterion.Consts.REVIEW_SCALE_RATING.NOT_APPLICABLE) {
                name.setValue('');
                description.setValue('');
            }

            name.setReadOnly(notApplicable);
            description.setReadOnly(notApplicable);
        }
    };

});
