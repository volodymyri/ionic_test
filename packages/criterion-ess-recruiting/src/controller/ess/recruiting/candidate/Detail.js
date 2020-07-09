Ext.define('criterion.controller.ess.recruiting.candidate.Detail', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_detail',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        handleBack() {
            let jobPostingId = this.getViewModel().get('jobPostingId');

            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS + '/' + jobPostingId + '/candidates');
        }
    }
});
