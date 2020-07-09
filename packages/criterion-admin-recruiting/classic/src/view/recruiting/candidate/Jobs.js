Ext.define('criterion.view.recruiting.candidate.Jobs', function() {

    const GLYPH = criterion.consts.Glyph;

    return {
        alias : 'widget.criterion_recruiting_candidate_jobs',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.jobPosting.Candidates',
            'criterion.ux.rating.Picker',
            'criterion.controller.recruiting.candidate.Jobs'
        ],

        tbar : null,

        viewModel : {
            data : {
                isSingleEmployer : true
            },
            stores : {
                jobPostingCandidates : {
                    type : 'criterion_job_posting_candidates',
                    proxy : {
                        extraParams : {
                            candidateId : '{candidateId}'
                        }
                    },
                    filters : [
                        {
                            property : 'id',
                            operator : '!=',
                            value : '{currentJobPostingCandidate.id}'
                        }
                    ]
                }
            }
        },

        controller : {
            type : 'criterion_recruiting_candidate_jobs'
        },

        bind : {
            store : '{jobPostingCandidates}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Job Title'),
                dataIndex : 'jobPostingTitle',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Department'),
                dataIndex : 'jobPostingDepartmentCd',
                codeDataId : criterion.consts.Dict.DEPARTMENT,
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'jobPostingEmployerLocation',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                dataIndex : 'employerId',
                renderer : function(value) {
                    let employersStore = Ext.StoreManager.lookup('Employers'),
                        employerRec = employersStore ? employersStore.getById(value) : null;

                    return employerRec ? employerRec.get('legalName') : '';
                },
                flex : 1,
                bind : {
                    hidden : '{isSingleEmployer}'
                }
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'candidateStatusCd',
                codeDataId : criterion.consts.Dict.CANDIDATE_STATUS,
                text : i18n.gettext('Candidate Status'),
                flex : 1
            },
            {
                xtype : 'widgetcolumn',
                dataIndex : 'rating',
                text : i18n.gettext('Rating'),
                width : 130,
                widget : {
                    xtype : 'criterion_rating',
                    family : 'Ionicons',
                    glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                    rounding : 0.5,
                    minimum : 0,
                    trackOver : false,
                    forViewOnly : true,
                    margin : 10
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-help-outline'],
                        tooltip : i18n.gettext('View Responses'),
                        handler : 'handleShowResponses',
                        isActionDisabled : (view, rowIndex, colIndex, item, record) => !record.get('hasAnswers')
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-person-outline'],
                        tooltip : i18n.gettext('Candidate'),
                        handler : 'handleEditJobPostingCandidate',
                        permissionAction : (v, cellValues, record, i, k, e, view) => criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS, criterion.SecurityManager.ACT)()
                    }
                ]
            }
        ]
    };

});

