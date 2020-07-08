Ext.define('ess.view.Recruiting', function() {

    var fn = function(page) {
        return function() {
            var main = this.up().down('ess_modern_recruiting');

            main.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            main.setActiveItem(main.down(page));
        }
    };

    return {
        alias : 'widget.ess_modern_recruiting',

        extend : 'Ext.Container',

        requires : [
            'ess.view.recruiting.JobPostingsList',
            'ess.view.recruiting.JobPostingDetail',
            'ess.view.recruiting.JobPostingCandidates',

            'ess.view.recruiting.jobPosting.CandidateDetail',
            'ess.view.recruiting.jobPosting.CandidateAdditionalDetails'
        ],

        title : 'Recruiting',

        cls : 'ess-modern-recruiting',

        layout : 'card',

        viewModel : {},

        listeners : {
            activate : function() {
                this.setActiveItem(this.down('ess_modern_recruiting_job_postings_list'));
            }
        },

        constructor : function(config) {
            var me = this;

            config.items = [
                {
                    xtype : 'ess_modern_recruiting_job_postings_list'
                },
                {
                    xtype : 'ess_modern_recruiting_job_posting_detail',
                    height : '100%',

                    listeners : {
                        close : fn('ess_modern_recruiting_job_postings_list').bind(me),
                        showCandidates : fn('ess_modern_recruiting_job_posting_candidates').bind(me)
                    }
                },
                {
                    xtype : 'ess_modern_recruiting_job_posting_candidates',
                    listeners : {
                        goBack : fn('ess_modern_recruiting_job_posting_detail').bind(me)
                    }
                },
                {
                    xtype : 'ess_modern_recruiting_job_posting_candidate_detail',
                    height : '100%',

                    listeners : {
                        close : fn('ess_modern_recruiting_job_posting_candidates').bind(me),
                        showCandidateAdditionalDetails : fn('ess_modern_recruiting_job_postings_candidate_additional_details').bind(me)
                    }
                },
                {
                    xtype : 'ess_modern_recruiting_job_postings_candidate_additional_details',
                    listeners : {
                        goBack : fn('ess_modern_recruiting_job_posting_candidate_detail').bind(me)
                    }
                }
            ];

            this.callParent(arguments);
        }

    };

});
