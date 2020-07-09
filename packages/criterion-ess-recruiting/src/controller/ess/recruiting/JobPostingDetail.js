Ext.define('criterion.controller.ess.recruiting.JobPostingDetail', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_job_posting_detail',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.employer.JobPosting'
        ],

        handleBack : function() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS);
        },

        handleShowCandidates : function() {
            var jobPostingId = this.getViewModel().get('jobPostingId');

            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS + '/' + jobPostingId + '/candidates');
        },

        handleActivate : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                jobPostingId = vm.get('jobPostingId'),
                jobPosting = Ext.create('criterion.model.employer.JobPosting', {
                    id : parseInt(jobPostingId, 10)
                });

            if (jobPostingId) {
                view.setLoading(true);
                jobPosting.loadWithPromise().then(function(record) {
                    vm.set('jobPosting', record);
                    view.setLoading(false);
                })
            }
        }
    }
});
