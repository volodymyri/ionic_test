Ext.define('criterion.controller.ess.recruiting.candidate.AdditionalDetails', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_additional_details',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        iterateStores : function(callback) {
            Ext.Array.each(['educations', 'experiences', 'awards', 'certifications', 'skills'], function(storeName) {
                callback(this.getStore(storeName))
            }, this);
        },

        getAdditionalStores : function(jobPostingCandidate) {
            var promises = [],
                candidateId = jobPostingCandidate.getCandidate().getId();

            this.iterateStores(function(store) {
                store.getProxy().setExtraParam('candidateId', candidateId);
                promises.push(store.loadWithPromise());
            });

            return promises;
        }
    }
});
