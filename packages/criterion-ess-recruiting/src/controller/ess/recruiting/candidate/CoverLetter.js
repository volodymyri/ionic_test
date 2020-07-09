Ext.define('criterion.controller.ess.recruiting.candidate.CoverLetter', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_cover_letter',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        additionalLoadProcess : function(jobPostingCandidate) {
            var candidate = jobPostingCandidate.getCandidate(),
                view = this.getView();

            if (candidate.get('hasCoverLetter')) {
                view.setSrc(criterion.consts.Api.API.CANDIDATE_COVER_LETTER_SHOW + '/' + candidate.getId());
            }

            this.getViewModel().set({
                isExternalSite : false,
                candidate : candidate
            });

            view.setLoading(false);
            this.afterLoading();
        }
    }
});
