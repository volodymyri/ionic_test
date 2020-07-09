Ext.define('criterion.view.ess.recruiting.candidate.Notes', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_notes',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.Notes',
            'criterion.view.ess.recruiting.candidate.Toolbar',
            'criterion.store.employer.jobPosting.candidate.Notes'
        ],

        viewModel : {
            data : {
                interview : null,
                activeViewIndex : 0,
                allowReview : false
            },

            stores : {
                jobPostingCandidateNotes : {
                    type : 'criterion_employer_job_posting_candidate_notes'
                }
            }
        },

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_notes'
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
                    store : '{jobPostingCandidateNotes}'
                },
                listeners : {
                    scope : 'controller',
                    beforecellclick : 'handleViewNote'
                },
                columns : [
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n._('Type'),
                        dataIndex : 'candidateNotesCd',
                        codeDataId : criterion.consts.Dict.CANDIDATE_NOTES,
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n._('Notes'),
                        dataIndex : 'notes',
                        flex : 3
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n._('Date'),
                        dataIndex : 'notesDate',
                        width : 150
                    }
                ]
            },
            // form
            {
                xtype : 'criterion_form',
                height : '100%',
                ui : 'clean',
                bodyPadding : 20,

                items : [
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel : i18n._('Date / Time'),
                        items : [
                            {
                                xtype : 'datefield',
                                name : 'notesDateDate',
                                fieldLabel : '',
                                hideLabel : true,
                                bind : '{note.notesDateDate}',
                                disabled : true,
                                margin : '0 10 0 0'
                            },
                            {
                                xtype : 'timefield',
                                name : 'notesDateTime',
                                fieldLabel : '',
                                hideLabel : true,
                                bind : '{note.notesDateTime}',
                                disabled : true,
                                flex : 1
                            }
                        ],
                        margin : '0 0 15 0'
                    },

                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n._('Type'),
                        name : 'candidateNotesCd',
                        bind : '{note.candidateNotesCd}',
                        disabled : true,
                        codeDataId : criterion.consts.Dict.CANDIDATE_NOTES
                    },
                    {
                        xtype : 'textarea',
                        fieldLabel : i18n._('Notes'),
                        name : 'notes',
                        height : 300,
                        disabled : true,
                        bind : '{note.notes}'
                    }
                ]
            }
        ]
    }
});
