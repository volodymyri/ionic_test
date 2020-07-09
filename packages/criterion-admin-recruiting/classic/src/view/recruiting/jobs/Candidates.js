Ext.define('criterion.view.recruiting.jobs.Candidates', function() {

    const GLYPH = criterion.consts.Glyph,
        MAX_COUNT_CANDIDATES_FOR_MASS_REJECTION = criterion.Consts.MAX_COUNT_CANDIDATES_FOR_MASS_REJECTION;

    return {
        alias : 'widget.criterion_recruiting_jobs_candidates',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.jobPosting.Candidates',
            'criterion.controller.recruiting.jobs.Candidates'
        ],

        controller : {
            type : 'criterion_recruiting_jobs_candidates',
            clearSelectionSilent : false
        },

        viewModel : {
            data : {
                selectedCount : 0
            },

            formulas : {
                allowRejectSelected : data => {
                    let selectedCount = data('selectedCount');

                    return selectedCount > 0 && selectedCount <= MAX_COUNT_CANDIDATES_FOR_MASS_REJECTION;
                },
                errorSelectionTxt : data => data('selectedCount') > MAX_COUNT_CANDIDATES_FOR_MASS_REJECTION ? i18n.gettext('Number of selected candidates is limited to ') + MAX_COUNT_CANDIDATES_FOR_MASS_REJECTION : ''
            }
        },

        tbar : [
            {
                xtype : 'button',
                text : i18n.gettext('Add Candidates'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddCandidates',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_CANDIDATES, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'component',
                cls : 'criterion-red',
                margin : '0 50 0 0',
                hidden : true,
                bind : {
                    html : '{errorSelectionTxt}',
                    hidden : '{!errorSelectionTxt}'
                }
            },
            {
                xtype : 'button',
                margin : '0 50 0 0',
                text : i18n.gettext('Reject Selected'),
                cls : 'criterion-btn-feature',
                hidden : true,
                bind : {
                    hidden : '{!allowRejectSelected}'
                },
                handler : 'handleRejectSelected'
            },
            {
                xtype : 'toggleslidefield',
                labelWidth : 100,
                margin : '0 10 0 0',
                fieldLabel : i18n.gettext('Show Inactive'),
                reference : 'showInactive',
                listeners : {
                    change : 'handleChangeShowInactive'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        selModel : {
            type : 'checkboxmodel',
            mode : 'MULTI',
            listeners : {
                scope : 'controller',
                selectionchange : 'onSelectionCandidate'
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('First Name'),
                dataIndex : 'firstName',
                flex : 1,
                minWidth : 120
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Last Name'),
                dataIndex : 'lastName',
                flex : 1,
                minWidth : 120
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'location',
                flex : 1,
                minWidth : 120
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Applied Date'),
                dataIndex : 'appliedDate',
                width : 140
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Source'),
                dataIndex : 'publishSiteName',
                width : 140
            },
            {
                xtype : 'widgetcolumn',
                dataIndex : 'rating',
                text : i18n.gettext('Rating'),
                width : 130,
                sortable : true,
                widget : {
                    xtype : 'criterion_rating',
                    family : 'Ionicons',
                    glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                    rounding : 0.5,
                    minimum : 0,
                    trackOver : false,
                    forViewOnly : true
                }
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'candidateStatusCd',
                codeDataId : criterion.consts.Dict.CANDIDATE_STATUS,
                text : i18n.gettext('Status'),
                flex : 1,
                minWidth : 120
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
                        handler : 'handleEditJobPostingCandidate'
                    }
                ]
            }
        ]
    };

});
