Ext.define('criterion.controller.ess.recruiting.candidate.Resume', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_resume',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        additionalLoadProcess : function(jobPostingCandidate) {
            var candidate = jobPostingCandidate.getCandidate(),
                view = this.getView();

            view.setSrc(criterion.consts.Api.API.CANDIDATE_RESUME_SHOW + '/' + candidate.getId());
            this.getViewModel().set({
                isExternalSite : false,
                candidate : candidate
            });

            view.setLoading(false);
            this.afterLoading();
        }
    }
});
