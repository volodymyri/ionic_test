Ext.define('criterion.view.recruiting.candidate.Notes', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_notes',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.jobPosting.candidate.Notes',
            'criterion.view.recruiting.JobPostingCandidateNoteForm',
            'criterion.controller.recruiting.candidate.Notes'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_notes',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_recruiting_job_posting_candidate_note_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        viewModel : {
            stores : {
                jobPostingCandidateNotes : {
                    type : 'criterion_employer_job_posting_candidate_notes',
                    proxy : {
                        extraParams : {
                            candidateId : '{candidateId}'
                        }
                    },
                    filters : [
                        {
                            property : 'jobPostingCandidateId',
                            operator : '==',
                            value : '{currentJobPostingCandidate.id}'
                        }
                    ]
                }
            }
        },

        bind : {
            store : '{jobPostingCandidateNotes}'
        },

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
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Date'),
                dataIndex : 'notesDate',
                width : 150
            }
        ]
    };

});


