Ext.define('ess.controller.recruiting.jobPosting.candidate.Notes', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_recruiting_job_postings_candidate_notes',

        handleActivate() {
            let view = this.getView(),
                vm = this.getViewModel();

            if (!this.checkViewIsActive()) {
                return;
            }

            view.setLoading(true);

            vm.get('jobPostingCandidateNotes').loadWithPromise({
                params : {
                    jobPostingCandidateId : vm.get('jobPostingCandidate.id')
                }
            }).always(_ => {
                view.setLoading(false);
            });
        }

    };
});
