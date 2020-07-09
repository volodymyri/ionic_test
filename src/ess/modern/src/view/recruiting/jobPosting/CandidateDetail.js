Ext.define('ess.view.recruiting.jobPosting.CandidateDetail', function() {

    return {

        alias : 'widget.ess_modern_recruiting_job_posting_candidate_detail',

        extend : 'criterion.view.FormView',

        defaults : {
            labelWidth : 150
        },

        cls : 'ess-modern-recruiting-job-posting-candidate-detail',

        viewModel : {
            data : {
                showActionPanel : false
            }
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                bind : {
                    title : '{jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName} &bull; {jobPosting.title}'
                },
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : 'handleCancel'
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-info-outline',
                        handler : function() {
                            this.up('ess_modern_recruiting_job_posting_candidate_detail').fireEvent('showCandidateAdditionalDetails');
                        }
                    }
                ]
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Location'),
                readOnly : true,
                bind : {
                    value : '{record.candidate.location}'
                }
            },
            {
                xtype : 'datepickerfield',
                label : i18n.gettext('Applied Date'),
                readOnly : true,
                bind : {
                    value : '{record.appliedDate}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                label : i18n.gettext('Status'),
                readOnly : true,
                codeDataId : criterion.consts.Dict.CANDIDATE_STATUS,
                bind : {
                    value : '{record.candidateStatusCd}'
                }
            },
            {
                xtype : 'criterion_rating',
                label : i18n.gettext('Rating'),
                readOnly : true,
                bind : {
                    value : '{record.rating}'
                }
            },
            {
                xtype : 'container',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'container',
                        cls : 'descriptionLabel',
                        html : '<span>Cover Letter Text</span>'
                    },
                    {
                        xtype : 'container',
                        cls : 'descriptionBlock',
                        bind : {
                            html : '{record.coverLetter}'
                        }
                    }
                ]
            }
        ]

    }
});
