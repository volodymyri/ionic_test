Ext.define('criterion.controller.settings.performanceReviews.ReviewPeriods', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_periods',

        extend : 'criterion.controller.GridView',

        _onCallbackLoad : function(editor, record) {
            this.callParent(arguments);

            editor.on('afterSave', this.onAfterSave, this);
        },

        onAfterSave : function() {
            this.load();
        }
    };

});
