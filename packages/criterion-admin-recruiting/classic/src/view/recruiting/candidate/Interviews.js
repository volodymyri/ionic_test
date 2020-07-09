Ext.define('criterion.view.recruiting.candidate.Interviews', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_interviews',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.jobPosting.candidate.Interviews',
            'criterion.view.recruiting.JobPostingCandidateInterviewForm',
            'criterion.controller.recruiting.candidate.Interviews'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_interviews',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : true,
            editor : {
                xtype : 'criterion_recruiting_job_posting_candidate_interview_form',
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
                jobPostingCandidateInterviews : {
                    type : 'criterion_employer_job_posting_candidate_interviews',
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
            store : '{jobPostingCandidateInterviews}'
        },

        listeners : {
            downloadAction : 'handleDownloadAction',
            scope : 'controller'
        },

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
            },
            {
                xtype : 'criterion_actioncolumn',
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        tooltip : i18n.gettext('Download'),
                        action : 'downloadAction',
                        permissionAction : (v, cellValues, record, i, k, e, view) => criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_INTERVIEW_DOWNLOAD, criterion.SecurityManager.ACT)()
                    }
                ]
            }
        ]
    };

});


