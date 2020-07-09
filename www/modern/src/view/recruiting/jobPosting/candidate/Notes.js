Ext.define('ess.view.recruiting.jobPosting.candidate.Notes', function() {

    return {

        alias : 'widget.ess_modern_recruiting_job_postings_candidate_notes',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.recruiting.jobPosting.candidate.Notes',
            'criterion.store.employer.jobPosting.candidate.Notes'
        ],

        controller : {
            type : 'ess_modern_recruiting_job_postings_candidate_notes'
        },

        listeners : {
            painted : 'handleActivate'
        },

        viewModel : {
            stores : {
                jobPostingCandidateNotes : {
                    type : 'criterion_employer_job_posting_candidate_notes'
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'panel',
                flex : 1,
                layout : 'card',

                items : [
                    {
                        xtype : 'criterion_gridview',
                        bind : {
                            store : '{jobPostingCandidateNotes}'
                        },

                        preventStoreLoad : true,

                        flex : 1,

                        columns : [
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : i18n.gettext('Type'),
                                dataIndex : 'candidateNotesCd',
                                codeDataId : criterion.consts.Dict.CANDIDATE_NOTES,
                                flex : 1
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Notes'),
                                dataIndex : 'notes',
                                flex : 2
                            },
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Date'),
                                dataIndex : 'notesDate',
                                width : 150
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

