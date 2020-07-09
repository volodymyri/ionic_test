Ext.define('criterion.controller.ess.recruiting.JobPostingCandidates', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_job_posting_candidates',

        extend : 'criterion.controller.GridView',

        handleBack : function() {
            var jobPostingId = this.getViewModel().get('jobPostingId');

            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS + '/' + jobPostingId + '/detail');
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

            this.callParent(arguments);
        },

        handleChangeShowInactive : function(cmp, value) {
            var store = this.getViewModel().getStore('jobPostingCandidates');

            if (store) {
                this.applyStoreShowActiveFilter(value, store);
            }
        },

        applyStoreShowActiveFilter : function(value, store) {
            store.clearFilter();

            if (!value) {
                store.setFilters([
                    {
                        property : 'activeStatus',
                        value : '1'
                    },
                    {
                        property : 'hiringManagerView',
                        value : '1'
                    }
                ]);
            } else {
                store.setFilters([
                    {
                        property : 'hiringManagerView',
                        value : '1'
                    }
                ])
            }
        },

        onJobPostingCandidatesLoad : function() {
            var value = this.lookup('showInactiveSelect').getValue(),
                store = this.getViewModel().getStore('jobPostingCandidates');

            store.setFilters([
                {
                    property : 'activeStatus',
                    value : '1'
                },
                {
                    property : 'hiringManagerView',
                    value : '1'
                }
            ]);
            Ext.defer(function() {
                this.applyStoreShowActiveFilter(value, store);
            }, 1, this);
        },

        handleEditAction : function(record) {
            var jobPostingId = this.getViewModel().get('jobPostingId');

            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS + '/' + jobPostingId + '/candidates/' + record.getId() + '/candidateDetail');
        }
    }
});
