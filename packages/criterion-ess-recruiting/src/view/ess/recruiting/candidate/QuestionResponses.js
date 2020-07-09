Ext.define('criterion.view.ess.recruiting.candidate.QuestionResponses', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_question_responses',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.QuestionResponses',
            'criterion.store.employer.Questions',
            'criterion.store.employer.QuestionValues',
            'criterion.view.ess.recruiting.candidate.Toolbar'
        ],

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_question_responses'
        },

        listeners : {
            activate : 'handleActivate'
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
                    type : 'criterion_question_values'
                }
            }
        },

        frame : true,

        header : {
            title : {
                bind : {
                    text : '{jobPosting.title} &bull; {jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName}'
                }
            }
        },

        tbar : {
            xtype : 'criterion_selfservice_recruiting_candidate_toolbar'
        },

        bbar : [
            '->',
            {
                xtype : 'criterion_button_back',
                handler : 'handleBack'
            }
        ],

        scrollable : true,

        items : [

        ]

    };
});
