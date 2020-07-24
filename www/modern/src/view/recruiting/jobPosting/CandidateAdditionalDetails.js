Ext.define('ess.view.recruiting.jobPosting.CandidateAdditionalDetails', function() {

    return {
        alias : 'widget.ess_modern_recruiting_job_postings_candidate_additional_details',

        extend : 'Ext.Container',

        requires : [
            'ess.view.recruiting.jobPosting.candidate.Details',
            'ess.view.recruiting.jobPosting.candidate.Interviews',
            'ess.view.recruiting.jobPosting.candidate.Resume',
            'ess.view.recruiting.jobPosting.candidate.QuestionResponses',
            'ess.view.recruiting.jobPosting.candidate.Notes'
        ],

        viewModel : {},

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                bind : {
                    title : '{jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName}'
                },
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : function() {
                            this.up('ess_modern_recruiting_job_postings_candidate_additional_details').fireEvent('goBack');
                        }
                    }
                ]
            },
            {
                xtype : 'tabpanel',
                tabBar : {
                    layout : {
                        pack : 'center'
                    }
                },
                activeTab : 1,
                flex : 1,
                defaults : {
                    scrollable : true
                },

                items : [
                    {
                        xtype : 'ess_modern_recruiting_job_postings_candidate_details',
                        title : i18n.gettext('Profile')
                    },
                    {
                        xtype : 'ess_modern_recruiting_job_postings_candidate_interviews',
                        title : i18n.gettext('Interview')
                    },
                    {
                        xtype : 'ess_modern_recruiting_job_postings_candidate_resume',
                        title : i18n.gettext('Resume')
                    },
                    {
                        xtype : 'ess_modern_recruiting_job_postings_candidate_question_responses',
                        title : i18n.gettext('Question Responses')
                    },
                    {
                        xtype : 'ess_modern_recruiting_job_postings_candidate_notes',
                        title : i18n.gettext('Notes')
                    }
                ]
            }
        ]
    }
});

