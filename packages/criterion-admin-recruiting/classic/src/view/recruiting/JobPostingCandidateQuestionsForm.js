Ext.define('criterion.view.recruiting.JobPostingCandidateQuestionsForm', function() {

    const DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_recruiting_job_posting_questions_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.recruiting.JobPostingCandidateQuestionsForm',
            'criterion.store.employer.Questions',
            'criterion.store.employer.QuestionValues'
        ],

        controller : {
            type : 'criterion_recruiting_job_posting_questions_form',
            externalUpdate : false
        },

        bind : {
            title : 'Candidate: {record.firstName} {record.lastName}'
        },

        listeners : {
            show : 'onShow'
        },

        onShowDataActivate : true,

        viewModel : {
            data : {
                controlStatus : true
            },

            stores : {
                questions : {
                    type : 'criterion_questions',
                    sorters : [
                        {
                            property : 'sequence',
                            direction : 'ASC'
                        }
                    ],
                    filters : [
                        {
                            property : 'isHidden',
                            value : false
                        }
                    ]
                },
                questionValues : {
                    type : 'criterion_question_values'
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
            }
        ],

        bodyPadding : 10,

        items : [
            {
                xtype : 'component',
                bind : {
                    hidden : '{!record}',
                    html : '{record.jobPostingTitle}'
                }
            },
            {
                xtype : 'component',
                hidden : true,
                html : i18n.gettext('No answers'),
                bind : {
                    hidden : '{questionValues.count}'
                }
            },
            {
                xtype : 'criterion_form',
                reference : 'response',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                }
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                hidden : true,
                bind : {
                    hidden : '{!controlStatus}'
                }
            },
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Status'),
                padding : 10,
                hidden : true,
                bind : {
                    value : '{record.candidateStatusCd}',
                    hidden : '{!controlStatus}'
                },
                codeDataId : DICT.CANDIDATE_STATUS
            }
        ],

        setJobPostingCandidate(jobPostingCandidate) {
            if (jobPostingCandidate && jobPostingCandidate.isModel) {
                this.getController().loadData(jobPostingCandidate);
            }
        }
    };
});
