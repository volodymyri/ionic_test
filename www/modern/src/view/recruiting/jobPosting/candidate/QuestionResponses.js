Ext.define('ess.view.recruiting.jobPosting.candidate.QuestionResponses', function() {

    return {
        alias : 'widget.ess_modern_recruiting_job_postings_candidate_question_responses',

        extend : 'Ext.form.Panel',

        requires : [
            'ess.controller.recruiting.jobPosting.candidate.QuestionResponses',
            'criterion.store.employer.Questions',
            'criterion.store.employer.QuestionValues'
        ],

        controller : {
            type : 'ess_modern_recruiting_job_postings_candidate_question_responses'
        },

        listeners : {
            painted : 'handleActivate'
        },

        viewModel : {
            stores : {
                questions : {
                    type : 'criterion_questions',
                    sorters : [{
                        property : 'sequence',
                        direction : 'ASC'
                    }],
                    filters : [{
                        property : 'isHidden',
                        value : false
                    }]
                },
                questionValues : {
                    type : 'criterion_question_values',
                    proxy : {
                        extraParams : {
                            jobPostingCandidateId : '{jobPostingCandidate.id}'
                        }
                    }
                }
            }
        },

        items : [

        ]
    }
});
