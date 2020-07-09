Ext.define('criterion.view.recruiting.candidate.CandidateForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_form',

        extend : 'criterion.ux.tab.Panel',

        cls : 'criterion-tabpanel',

        requires : [
            'criterion.controller.recruiting.candidate.CandidateForm',
            'criterion.view.recruiting.candidate.Demographics',
            'criterion.view.recruiting.candidate.CandidateProfile',
            'criterion.view.recruiting.candidate.Jobs',
            'criterion.view.recruiting.candidate.Resume',
            'criterion.view.recruiting.candidate.CoverLetter',
            'criterion.view.recruiting.candidate.Notes',
            'criterion.view.recruiting.candidate.Documents',
            'criterion.view.recruiting.candidate.Attachments',
            'criterion.view.recruiting.JobPostingCandidateQuestionsForm',
            'criterion.view.recruiting.candidate.Interviews'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_form'
        },

        listeners : {
            scope : 'controller',
            tabChange : 'onTabChange',
            candidateSelect : 'onCandidateSelect'
        },

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            }
        ],

        viewModel : {
            data : {
                /**
                 * @type criterion.model.Candidate
                 */
                candidate : null,
                candidateId : null,
                hideToolbar : false
            },
            formulas : {
                hasEmail : data => !!data('candidate.email'),
                isAddResumeResumeButtonDisabled : data => (data('candidate') ? data('candidate').phantom : true) || !!data('candidate.hasResume')
            }
        },

        useRouter : true,

        minTabWidth : 300,
        bodyPadding : 0,

        defaults : {
            bodyPadding : 0,

            dockedItems : [
                {
                    xtype : 'panel',
                    dock : 'top',
                    hidden : false,
                    bind : {
                        hidden : '{hideToolbar}'
                    },
                    header : {
                        bind : {
                            title : '{candidate.firstName:htmlEncode} {candidate.lastName:htmlEncode}'
                        },
                        items : [
                            {
                                xtype : 'button',
                                text : i18n.gettext('Add Resume'),
                                cls : 'criterion-btn-feature',
                                handler : 'onAddResume',
                                disabled : true,
                                hidden : true,
                                bind : {
                                    disabled : '{isAddResumeResumeButtonDisabled}',
                                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                        append : 'candidate.phantom ||',
                                        rules : [
                                            {
                                                key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME,
                                                actName : criterion.SecurityManager.CREATE,
                                                reverse : true
                                            }
                                        ]
                                    })
                                }
                            },
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-transparent',
                                glyph : criterion.consts.Glyph['ios7-email-outline'],
                                scale : 'medium',
                                handler : 'onEmailSend',
                                disabled : true,
                                hidden : true,
                                bind : {
                                    disabled : '{!hasEmail}',
                                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_WRITE_EMAIL, criterion.SecurityManager.ACT, true)
                                },
                                margin : '0 5 0 0'
                            },
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['chatbox-working'],
                                handler : 'onShowNotes',
                                tooltip : i18n.gettext('Notes'),
                                cls : 'criterion-btn-like-link',
                                scale : 'medium',
                                margin : '0 5 0 0',
                                hidden : true,
                                bind : {
                                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_NOTES, criterion.SecurityManager.READ, true)
                                }
                            }
                        ]
                    }
                }
            ]
        },

        items : [
            {
                xtype : 'criterion_recruiting_candidate_interviews',
                title : i18n.gettext('Interview'),
                itemId : 'interview',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_INTERVIEW, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_candidate_resume',
                title : i18n.gettext('Resume'),
                itemId : 'resume',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_panel',
                layout : 'fit',

                title : i18n.gettext('Application Questions'),
                itemId : 'applicationQuestions',

                items : [
                    {
                        xtype : 'container',
                        layout : 'vbox',
                        scrollable : 'vertical',
                        items : [
                            {
                                title : i18n.gettext('Application Questions'),
                                cls : 'transparent-bg-header minimized-header',
                                width : '100%',
                                margin : '15 0 0 20',
                                bodyPadding : '10 0 0 0',
                                header : {
                                    padding : '0 0 8'
                                },

                                items : [
                                    {
                                        xtype : 'criterion_recruiting_job_posting_questions_form',
                                        plugins : null,
                                        onShowDataActivate : false,
                                        noButtons : true,
                                        bind : {
                                            jobPostingCandidate : '{currentJobPostingCandidate}'
                                        },
                                        viewModel : {
                                            data : {
                                                controlStatus : false
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_recruiting_candidate_cover_letter',
                title : i18n.gettext('Cover Letter'),
                itemId : 'coverLetter',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_COVER_LETTER, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_candidate_profile',
                title : i18n.gettext('Profile'),
                reference : 'candidateProfile',
                itemId : 'profile',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_candidate_demographics',
                title : i18n.gettext('Demographics'),
                reference : 'demographics',
                itemId : 'demographics'
            },
            {
                xtype : 'criterion_recruiting_candidate_notes',
                title : i18n.gettext('Notes'),
                itemId : 'notes',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_NOTES, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_candidate_attachments',
                title : i18n.gettext('Attachments'),
                itemId : 'attachments',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_ATTACHMENT, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_candidate_documents',
                title : i18n.gettext('Forms'),
                itemId : 'forms',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_FORM, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_candidate_jobs',
                title : i18n.gettext('Other Applications'),
                itemId : 'jobs',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_JOBS, criterion.SecurityManager.READ),
                listeners : {
                    jpCandidateChanged : 'onJpCandidateChanged'
                }
            }
        ],

        setTabsDisabled(disabled) {
            this.getTabBar().items.each((item, idx) => {
                if (idx > 0) {
                    item.setDisabled(disabled);
                }
            });
        },

        setCandidateId(candidateId) {
            this.fireEvent('candidateSelect', candidateId);
        },

        onCandidateUpdated() {
            this.getController().onCandidateUpdated();
        }
    };

});
