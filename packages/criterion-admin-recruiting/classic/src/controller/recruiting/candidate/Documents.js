Ext.define('criterion.controller.recruiting.candidate.Documents', function() {

    return {
        alias : 'controller.criterion_recruiting_candidate_documents',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.store.employer.jobPosting.Candidates'
        ],

        mixins : [
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers'
        ],

        load : function() {
            var vm = this.getViewModel();

            this.callParent([
                {
                    params : {
                        candidateId : vm.get('candidateId')
                    }
                }
            ]);
        },

        getEmptyRecord : function() {
            var vm = this.getViewModel();

            return {
                candidateId : vm.get('candidateId')
            };
        },

        createEditor : function(editorCfg, record) {
            editorCfg.viewModel = {
                stores : {
                    jobPostingCandidates : {
                        type : 'criterion_job_posting_candidates',
                        autoLoad : true,
                        proxy : {
                            extraParams : {
                                candidateId : this.getViewModel().get('candidateId')
                            }
                        }
                    }
                }
            };

            return this.callParent([editorCfg, record]);
        }
    };

});
