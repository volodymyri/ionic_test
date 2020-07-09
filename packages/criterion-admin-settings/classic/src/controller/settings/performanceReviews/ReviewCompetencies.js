Ext.define('criterion.controller.settings.performanceReviews.ReviewCompetencies', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_competencies',

        extend : 'criterion.controller.GridView',

        load : function(opts) {
            var vm = this.getViewModel();

            Ext.Deferred.sequence([
                function() {
                    return vm.getStore('reviewScales').loadWithPromise();
                },
                function() {
                    return vm.getStore('reviewCompetencies').loadWithPromise(Ext.apply({}, opts));
                }
            ]);
        }
    };

});
