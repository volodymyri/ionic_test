Ext.define('criterion.view.ess.recruiting.candidate.Interview', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_interview',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.Interview',
            'criterion.view.ess.recruiting.candidate.Toolbar',
            'criterion.store.employer.jobPosting.candidate.interview.Reviews',
            'criterion.store.reviewScale.Details',
            'criterion.store.ReviewCompetencies'
        ],

        viewModel : {
            data : {
                interview : null,
                activeViewIndex : 0,
                allowReview : false
            },

            stores : {
                jobPostingCandidateInterviews : {
                    type : 'criterion_employer_job_posting_candidate_interview_reviews'
                },
                reviewScaleDetails : {
                    type : 'criterion_review_scale_details',
                    sorters : [{
                        property : 'rating',
                        direction : 'ASC'
                    }]
                },
                reviewCompetencies : {
                    type : 'criterion_review_competencies',
                    grouper : {
                        property : 'reviewCompetencyGroupCd',
                        sortProperty : 'groupSequence',
                        transform : sequence => parseInt(sequence, 10) || Number.MAX_VALUE
                    }
                }
            }
        },

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_interview'
        },

        listeners : {
            activate : 'handleActivate'
        },

        layout : {
            type : 'card'
        },

        bind : {
            activeItem : '{activeViewIndex}'
        },

        cls : 'criterion-tab-bar-top-border',

        frame : true,

        header : {
            title : {
                bind : {
                    text : '{jobPosting.title} &bull; {jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName}'
                }
            }
        },

        bbar : [
            '->',
            {
                xtype : 'criterion_button_back',
                handler : 'handleBack'
            },
            {
                xtype : 'button',
                text : i18n._('Save'),
                ui : 'feature',
                handler : 'handleSaveReviewInterview',
                hidden : true,
                bind : {
                    hidden : '{!activeViewIndex || !allowReview}'
                },
                margin : '0 0 0 10'
            }
        ],

        dockedItems : [
            {
                xtype : 'criterion_selfservice_recruiting_candidate_toolbar'
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',
                ui : 'clean',
                height : '100%',
                bind : {
                    store : '{jobPostingCandidateInterviews}'
                },
                listeners : {
                    scope : 'controller',
                    beforecellclick : 'handleViewInterviewDetail'
                },
                columns : [
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n._('Type'),
                        dataIndex : 'interviewTypeCd',
                        codeDataId : criterion.consts.Dict.INTERVIEW_REVIEW_TYPE,
                        flex : 1
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n._('Date'),
                        dataIndex : 'interviewDate',
                        width : 150
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n._('Duration'),
                        dataIndex : 'interviewDuration',
                        width : 150
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n._('Address'),
                        dataIndex : 'interviewAddress',
                        flex : 1
                    }
                ]
            },
            // form
            {
                xtype : 'criterion_form',
                height : '100%',
                ui : 'clean',

                items : [
                    {
                        xtype : 'container',
                        flex : 1,
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                xtype : 'container',
                                defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,
                                items : [
                                    {
                                        xtype : 'container',

                                        plugins : [
                                            'criterion_responsive_column'
                                        ],
                                        items : [
                                            {
                                                xtype : 'container',

                                                items : [
                                                    {
                                                        xtype : 'criterion_code_detail_field',
                                                        fieldLabel : i18n._('Interview Type'),
                                                        bind : '{interview.interviewTypeCd}',
                                                        codeDataId : criterion.consts.Dict.INTERVIEW_REVIEW_TYPE,
                                                        disabled : true
                                                    },

                                                    {
                                                        xtype : 'fieldcontainer',
                                                        layout : 'hbox',
                                                        fieldLabel : i18n._('Date / Time'),
                                                        requiredMark : true,
                                                        items : [
                                                            {
                                                                xtype : 'datefield',
                                                                fieldLabel : '',
                                                                hideLabel : true,
                                                                bind : '{interview.interviewDate}',
                                                                margin : '0 10 0 0',
                                                                disabled : true
                                                            },
                                                            {
                                                                xtype : 'timefield',
                                                                fieldLabel : '',
                                                                hideLabel : true,
                                                                bind : '{interview.interviewDate}',
                                                                flex : 1,
                                                                disabled : true
                                                            }
                                                        ],
                                                        margin : '0 0 15 0'
                                                    }
                                                ]
                                            },
                                            {
                                                items : [
                                                    {
                                                        xtype : 'combobox',
                                                        fieldLabel : i18n._('Duration') + '<br><span class="fs-08">' + i18n._('(minutes)') + '</span>',
                                                        valueField : 'minutes',
                                                        bind : '{interview.interviewDuration}',
                                                        displayField : 'text',
                                                        store : Ext.create('Ext.data.Store', {
                                                            fields : ['minutes', 'text'],
                                                            data : criterion.Consts.INTERVIEW_DURATIONS
                                                        }),
                                                        disabled : true
                                                    },
                                                    {
                                                        xtype : 'textfield',
                                                        fieldLabel : i18n._('Address'),
                                                        bind : '{interview.interviewAddress}',
                                                        disabled : true
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype : 'container',
                                reference : 'interviewReview',
                                flex : 1,
                                layout : {
                                    type : 'vbox',
                                    align : 'stretch'
                                },
                                scrollable : true,
                                items : [
                                    // filled dynamically
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
