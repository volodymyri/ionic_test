Ext.define('ess.view.recruiting.jobPosting.candidate.Interviews', function() {

    return {

        alias : 'widget.ess_modern_recruiting_job_postings_candidate_interviews',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.recruiting.jobPosting.candidate.Interviews',
            'criterion.store.employer.jobPosting.candidate.interview.Reviews',
            'criterion.store.reviewScale.Details',
            'criterion.store.ReviewCompetencies'
        ],

        controller : {
            type : 'ess_modern_recruiting_job_postings_candidate_interviews'
        },

        listeners : {
            painted : 'handleActivate'
        },

        viewModel : {
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

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        constructor : function(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'panel',
                    flex : 1,
                    height : '100%',
                    layout : 'card',
                    reference : 'container',

                    items : [
                        {
                            xtype : 'criterion_gridview',
                            reference : 'grid',
                            bind : {
                                store : '{jobPostingCandidateInterviews}'
                            },

                            listeners : {
                                doEdit : function(record) {
                                    me.getController().showForm(record);
                                }
                            },

                            preventStoreLoad : true,

                            flex : 1,

                            columns : [
                                {
                                    xtype : 'criterion_codedatacolumn',
                                    text : i18n.gettext('Type'),
                                    dataIndex : 'interviewTypeCd',
                                    codeDataId : criterion.consts.Dict.INTERVIEW_REVIEW_TYPE,
                                    flex : 1
                                },
                                {
                                    xtype : 'datecolumn',
                                    text : i18n.gettext('Date'),
                                    dataIndex : 'interviewDate',
                                    width : 150
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Duration'),
                                    dataIndex : 'interviewDuration',
                                    width : 150
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Address'),
                                    dataIndex : 'interviewAddress',
                                    flex : 1
                                }
                            ]
                        },

                        {
                            xtype : 'panel',
                            reference : 'form',
                            scrollable : true,
                            padding : '0 15 10 15',

                            viewModel : {
                                data : {
                                    interview : null
                                }
                            },

                            items : [
                                {
                                    xtype : 'criterion_code_detail_select',
                                    codeDataId : criterion.consts.Dict.INTERVIEW_REVIEW_TYPE,
                                    label : i18n.gettext('Interview Type'),
                                    bind : '{interview.interviewTypeCd}',
                                    disabled : true
                                },
                                {
                                    xtype : 'datefield',
                                    label : i18n.gettext('Date / Time'),
                                    bind : '{interview.interviewDate}',
                                    disabled : true
                                },
                                {
                                    xtype : 'criterion_combobox',
                                    label : i18n.gettext('Duration'),
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
                                    label : i18n.gettext('Address'),
                                    bind : '{interview.interviewAddress}',
                                    disabled : true
                                },

                                {
                                    xtype : 'container',
                                    reference : 'interviewReview',
                                    flex : 1,
                                    margin : '20 0 0 0',
                                    layout : {
                                        type : 'vbox',
                                        align : 'stretch'
                                    },
                                    items : [
                                        // filled dynamically
                                    ]
                                }
                            ],

                            bbar : [
                                '->',
                                {
                                    xtype : 'button',
                                    ui : 'act-btn-cancel',
                                    text : i18n.gettext('Back'),
                                    margin : '0 20 0 0',
                                    handler : 'handleBack'
                                },
                                {
                                    xtype : 'button',
                                    ui : 'act-btn-save',
                                    text : i18n.gettext('Save'),
                                    handler : 'handleSave'
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    }
});

