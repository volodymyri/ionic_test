Ext.define('ess.controller.recruiting.JobPostingCandidates', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_recruiting_job_posting_candidates',

        handleBack : function() {
            this.getView().fireEvent('goBack');
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

        showCandidateDetail : function(record) {
            var parent = this.getView().up(),
                form = parent.down('ess_modern_recruiting_job_posting_candidate_detail');

            form.getViewModel().set('record', record);
            parent.getViewModel().set('jobPostingCandidate', record);
            parent.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            parent.setActiveItem(form);
        }

    };
});
