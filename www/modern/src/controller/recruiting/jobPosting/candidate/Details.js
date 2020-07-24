Ext.define('ess.controller.recruiting.jobPosting.candidate.Details', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_recruiting_job_postings_candidate_details',

        handleActivate : function() {
            var view = this.getView();

            if (!this.checkViewIsActive()) {
                return;
            }

            view.setLoading(true);
            Ext.promise.Promise.all(this.getAdditionalStores()).then({
                scope : this,
                success : function() {
                    view.setLoading(false);
                }
            })
        },

        getAdditionalStores : function() {
            var promises = [],
                vm = this.getViewModel(),
                candidateId = parseInt(vm.get('jobPostingCandidate.candidate.id'), 10);

            Ext.Array.each(['educations', 'experiences', 'awards', 'certifications', 'skills'], function(storeName) {
                var store = vm.getStore(storeName);

                if (!store.isLoaded() || this.loadedCandidateId !== candidateId) {
                    promises.push(vm.getStore(storeName).loadWithPromise());
                }
            }, this);

            this.loadedCandidateId = candidateId;
            return promises;
        },

        handleChangeShowedData : function(cmp, value) {
            if (!this.checkViewIsActive()) {
                return;
            }

            this.lookup('dataPanel').setActiveItem(value);
        }

    };
});
