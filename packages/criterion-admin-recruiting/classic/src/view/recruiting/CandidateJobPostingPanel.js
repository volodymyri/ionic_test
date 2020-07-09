Ext.define('criterion.view.recruiting.CandidateJobPostingPanel', function() {

    const GLYPH = criterion.consts.Glyph,
        DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_recruiting_candidate_job_posting_panel',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.plugin.Affix',
            'criterion.ux.form.field.plugin.DisplayOnly',
            'criterion.ux.rating.Picker',
            'criterion.store.employer.jobPosting.Candidates',
            'criterion.controller.recruiting.CandidateJobPostingPanel'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_job_posting_panel'
        },

        viewModel : {
            data : {
                candidateId : null,
                jobPostingCandidateCount : 0,
                jobPostingCandidate : null,
                jobPostingCandidateId : null
            },

            formulas : {
                hasEmail : data => data('detailsGrid.selection.candidate.email'),
                hasResume : data => data('detailsGrid.selection.candidate.hasResume'),
                hasCoverLetter : data => data('detailsGrid.selection.candidate.hasCoverLetter'),
                showApplicationFormValue : data => data('detailsGrid.selection.isEmploymentApplicationConfigured') ? 2 : 1
            },

            stores : {
                jobPostingCandidates : {
                    type : 'criterion_job_posting_candidates',
                    sorters : [
                        {
                            property : 'appliedDate',
                            direction : 'DESC'
                        }
                    ],
                    proxy : {
                        extraParams : {
                            candidateId : '{candidateId}'
                        }
                    }
                }
            }
        },

        listeners : {
            jpCandidateChanged : 'onJpCandidateChanged'
        },

        items : [
            {
                xtype : 'container',
                cls : 'first-line',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                padding : '10 20 0 20',
                items : [
                    {
                        xtype : 'component',
                        cls : 'candidateTitle',
                        bind : {
                            html : '{detailsGrid.selection.candidate.firstName:htmlEncode} {detailsGrid.selection.candidate.lastName:htmlEncode}'
                        },
                        margin : '10 0 10 0'
                    },
                    {
                        xtype : 'combobox',
                        margin : '0 0 10 30',
                        bind : {
                            store : '{jobPostingCandidates}',
                            hidden : '{!jobPostingCandidateCount}',
                            value : '{jobPostingCandidateId}',
                            selection : '{jobPostingCandidate}'
                        },
                        hidden : true,
                        hideLabel : true,
                        displayField : 'jobPostingPositionTitle',

                        valueField : 'id',
                        queryMode : 'local'
                    },
                    {
                        xtype : 'component',
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add Resume'),
                        cls : 'criterion-btn-new-primary criterion-btn-sm-glyph',
                        glyph : criterion.consts.Glyph['plus'],
                        handler : 'handleAddResume',
                        disabled : true,
                        hidden : true,
                        bind : {
                            disabled : '{hasResume}',
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME,
                                        actName : criterion.SecurityManager.CREATE,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        margin : '5 0 10 0'
                    },
                    {
                        xtype : 'button',
                        padding : '0 0 0 15',
                        margin : '0 0 10 0',
                        glyph : criterion.consts.Glyph['email-unread'],
                        handler : 'handleSendEmail',
                        tooltip : i18n.gettext('Send Email'),
                        cls : 'criterion-btn-like-link',
                        scale : 'medium',
                        disabled : true,
                        hidden : true,
                        bind : {
                            disabled : '{!hasEmail}',
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_WRITE_EMAIL, criterion.SecurityManager.ACT, true)
                        }
                    },
                    {
                        xtype : 'combobox',
                        margin : '0 0 10 15',
                        cls : 'combobox-as-button',
                        width : 36,
                        matchFieldWidth : false,
                        listConfig : {
                            minWidth : 200
                        },
                        store : {
                            fields : ['text', 'action', 'show'],
                            data : [
                                {
                                    text : i18n.gettext('Order Background Report'),
                                    action : 'order_background_report',
                                    show : 1
                                },
                                {
                                    text : i18n.gettext('View Background Report'),
                                    action : 'view_background_report',
                                    show : 1
                                },
                                {
                                    text : i18n.gettext('Create New Employee'),
                                    action : 'create_new_employee',
                                    show : 1
                                },
                                {
                                    text : i18n.gettext('Send Form'),
                                    action : 'send_form',
                                    show : 1
                                },
                                {
                                    text : i18n.gettext('View Submitted Forms'),
                                    action : 'view_submitted_forms',
                                    show : 1
                                },
                                {
                                    text : i18n.gettext('Preboarding'),
                                    action : 'preboarding',
                                    show : 1
                                },
                                {
                                    text : i18n.gettext('Download Application Form'),
                                    action : 'download_application_form',
                                    show : 2
                                }
                            ]
                        },
                        listeners : {
                            change : 'handleSelectAction'
                        },
                        sortByDisplayField : false,
                        displayField : 'text',
                        valueField : 'action',
                        forceSelection : false,
                        allowBlank : true,
                        editable : false,
                        bind : {
                            filters : {
                                property : 'show',
                                value : ['{showApplicationFormValue}', 1],
                                operator : 'in'
                            }
                        }
                    }
                ]
            },

            // second line
            {
                xtype : 'container',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                cls : 'second-line',
                padding : 10,
                items : [
                    {
                        xtype : 'container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                xtype : 'criterion_person_phone_number',

                                plugins : [
                                    {
                                        ptype : 'criterion_display_only'
                                    },
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-ios7-home',
                                            margin : '0 10 0 10'
                                        }
                                    }
                                ],

                                fieldLabel : '',
                                hideLabel : true,

                                formatParams : {
                                    countryCode : 'US'
                                },

                                hidden : true,

                                bind : {
                                    rawNumber : '{detailsGrid.selection.candidate.homePhone}',
                                    displayNumber : '{detailsGrid.selection.candidate.homePhoneUS}',
                                    hidden : '{!detailsGrid.selection.candidate.homePhoneUS}'
                                }
                            },
                            {
                                xtype : 'criterion_person_phone_number',

                                plugins : [
                                    {
                                        ptype : 'criterion_display_only'
                                    },
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-android-phone-portrait',
                                            margin : '0 10 0 10'
                                        }
                                    }
                                ],

                                fieldLabel : '',
                                hideLabel : true,

                                formatParams : {
                                    countryCode : 'US'
                                },

                                hidden : true,

                                bind : {
                                    rawNumber : '{detailsGrid.selection.candidate.mobilePhone}',
                                    displayNumber : '{detailsGrid.selection.candidate.mobilePhoneUS}',
                                    hidden : '{!detailsGrid.selection.candidate.mobilePhoneUS}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : '',
                                hideLabel : true,
                                plugins : [
                                    {
                                        ptype : 'criterion_display_only'
                                    },
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-ios7-email',
                                            margin : '0 10 0 10'
                                        }
                                    }
                                ],
                                bind : '{detailsGrid.selection.candidate.email}'
                            },

                            {
                                xtype : 'tbfill'
                            },

                            {
                                xtype : 'container',
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },

                                responsiveConfig : criterion.Utils.createResponsiveConfig([
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                                        config : {
                                            hidden : true
                                        }
                                    },
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                        config : {
                                            hidden : false
                                        }
                                    }
                                ]),

                                items : [
                                    {
                                        xtype : 'component',
                                        html : '<span class="x-form-item-label-default">' + i18n.gettext('Rating') + '</span>',
                                        margin : '10 0 0 0',
                                        bind : {
                                            hidden : '{!jobPostingCandidate}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_rating',
                                        fieldLabel : '',
                                        hideLabel : true,
                                        family : 'Ionicons',
                                        glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                                        rounding : 0.5,
                                        minimum : 0,
                                        scale : '1.2em',
                                        listeners : {
                                            afterClick : 'handleSave'
                                        },
                                        margin : '10 20 0 0',
                                        forViewOnly : true,
                                        bind : {
                                            value : '{jobPostingCandidate.rating}',
                                            hidden : '{!jobPostingCandidate}',
                                            forViewOnly : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS, criterion.SecurityManager.ACT, true)
                                        }
                                    },
                                    {
                                        xtype : 'component',
                                        html : '<span class="x-form-item-label-default">' + i18n.gettext('Status') + '</span>',
                                        margin : '10 0 0 0',
                                        bind : {
                                            hidden : '{!jobPostingCandidate}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : '',
                                        hideLabel : true,
                                        width : 150,
                                        minWidth : 150,
                                        margin : '0 20 0 0',
                                        codeDataId : DICT.CANDIDATE_STATUS,
                                        editable : false,
                                        forceSelection : true,
                                        listeners : {
                                            select : 'handleSave'
                                        },
                                        disabled : true,
                                        bind : {
                                            value : '{jobPostingCandidate.candidateStatusCd}',
                                            hidden : '{!jobPostingCandidate}',
                                            disabled : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS, criterion.SecurityManager.ACT, true)
                                        }
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        xtype : 'container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        responsiveConfig : criterion.Utils.createResponsiveConfig([
                            {
                                rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                                config : {
                                    hidden : false
                                }
                            },
                            {
                                rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                config : {
                                    hidden : true
                                }
                            }
                        ]),
                        items : [
                            {
                                xtype : 'component',
                                html : '<span class="x-form-item-label-default">' + i18n.gettext('Rating') + '</span>',
                                margin : '10 0 0 10'
                            },
                            {
                                xtype : 'criterion_rating',
                                fieldLabel : '',
                                hideLabel : true,
                                family : 'Ionicons',
                                glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                                rounding : 0.5,
                                minimum : 0,
                                scale : '1.2em',
                                listeners : {
                                    afterClick : 'handleSave'
                                },
                                margin : Ext.isIE11 ? '5 20 0 0' : '10 20 0 0',
                                forViewOnly : true,
                                bind : {
                                    value : '{detailsGrid.selection.rating}',
                                    forViewOnly : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS, criterion.SecurityManager.ACT, true)
                                }
                            },
                            {
                                xtype : 'tbfill'
                            },
                            {
                                xtype : 'component',
                                html : '<span class="x-form-item-label-default">' + i18n.gettext('Status') + '</span>',
                                margin : '10 0 0 0'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : '',
                                hideLabel : true,
                                width : 150,
                                minWidth : 150,
                                margin : '0 20 0 0',
                                codeDataId : DICT.CANDIDATE_STATUS,
                                editable : false,
                                forceSelection : true,
                                listeners : {
                                    select : 'handleSave'
                                },
                                disabled : true,
                                bind : {
                                    value : '{detailsGrid.selection.candidateStatusCd}',
                                    disabled : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS, criterion.SecurityManager.ACT, true)
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
