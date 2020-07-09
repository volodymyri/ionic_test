Ext.define('criterion.controller.recruiting.candidate.Jobs', function() {

    return {
        alias : 'controller.criterion_recruiting_candidate_jobs',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.recruiting.JobPostingCandidateForm',
            'criterion.view.recruiting.JobPostingCandidateQuestionsForm'
        ],

        mixins : [
            'criterion.controller.mixin.SingleEmployer',
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers'
        ],

        handleShowResponses(grid, index1, index2, act, e, record) {
            let view = this.getView(),
                form = Ext.create('criterion.view.recruiting.JobPostingCandidateQuestionsForm', {
                viewModel : {
                    data : {
                        record : record
                    }
                }
            });

            form.show();
            form.on('afterSave', () => {
                view.fireEvent('jpCandidateChanged', record);
            });
        },

        handleEditJobPostingCandidate(grid, index1, index2, act, e, record) {
            let view = this.getView(),
                form = Ext.create('criterion.view.recruiting.JobPostingCandidateForm', {
                viewModel : {
                    data : {
                        record : record
                    }
                }
            });

            form.show();
            form.on('formSubmitted', () => {
                view.fireEvent('jpCandidateChanged', record);
            });
        }
    };

});
