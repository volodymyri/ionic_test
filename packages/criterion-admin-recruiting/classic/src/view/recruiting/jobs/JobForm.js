Ext.define('criterion.view.recruiting.jobs.JobForm', function() {

    return {
        alias : 'widget.criterion_recruiting_jobs_job_form',

        extend : 'criterion.ux.tab.Panel',

        cls : 'criterion-tabpanel',

        requires : [
            'criterion.controller.recruiting.jobs.JobForm',

            'criterion.view.recruiting.jobs.Position',
            'criterion.view.recruiting.jobs.Candidates',
            'criterion.view.recruiting.jobs.Publish',

            'criterion.store.Positions',
            'criterion.store.employer.jobPosting.Candidates',
            'criterion.store.employer.WorkLocations',
            'criterion.store.employer.WorkPeriods',
            'criterion.store.employer.recruiting.Settings',
            'criterion.store.ReviewTemplates',

            'criterion.store.employer.QuestionSets',
            'criterion.store.WebForms'
        ],

        viewModel : {
            data : {
                jobPosting : null
            },
            formulas : {
                isPhantom : data => data('jobPosting') ? data('jobPosting').phantom : true,

                candidatesTitle : {
                    bind : {
                        bindTo : '{jobPostingCandidates}',
                        deep : true
                    },
                    get : function(jobPostingCandidates) {
                        let count = 0;

                        if (jobPostingCandidates) {
                            jobPostingCandidates.each(item => {
                                let candidateStatusCd = item.get('candidateStatusCd'),
                                    jpRecord = criterion.CodeDataManager.getCodeDetailRecord('id', candidateStatusCd, criterion.consts.Dict.CANDIDATE_STATUS),
                                    attr1Val = jpRecord ? parseInt(jpRecord.get('attribute1'), 10) : 1;

                                if (attr1Val) {
                                    count++;
                                }
                            });
                        }

                        return i18n.gettext('Candidates') + (count ? ' (' + count + ')' : '');
                    }
                },

                jobPostingStatus : function(data) {
                    let jobPosting = data('jobPosting'),
                        statusCd = jobPosting && jobPosting.get('statusCd'),
                        status = criterion.CodeDataManager.getCodeDetailRecord('id', statusCd, criterion.consts.Dict.JOB_POSTING_STATUS);

                    return status && status.get('description');
                },

                getPanelHeaderTitle : function(data) {
                    let jobPosting = data('jobPosting'),
                        requisitionCode = jobPosting && jobPosting.get('requisitionCode'),
                        headerTitle;

                    if (!jobPosting) {
                        return;
                    }

                    headerTitle = '<span class="x-title-item">' + jobPosting.get('title') + '</span>';

                    if (!Ext.isEmpty(requisitionCode)) {
                        headerTitle += ' / <span style="font-weight:normal">#' + requisitionCode + '</span>';
                    }

                    return '<div class="x-title-text x-title-text-default">' + headerTitle + '</div>';
                },

                hiringManagers : {
                    bind : {
                        bindTo : '{jobPosting.hiringManagers}',
                        deep : true
                    },
                    get : function(hiringManagers) {
                        let names = [];

                        if (hiringManagers) {
                            hiringManagers.each(hiringManager => {
                                names.push(hiringManager.get('fullName'));
                            });
                        }

                        return names.join(', ');
                    }
                }
            },
            stores : {
                webForms : {
                    type : 'criterion_web_forms'
                },
                questionSets : {
                    type : 'criterion_question_sets'
                },
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                jobPostingCandidates : {
                    type : 'criterion_job_posting_candidates'
                },
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                settings : {
                    type : 'criterion_employer_recruiting_settings'
                },
                reviewTemplates : {
                    type : 'criterion_review_templates',
                    proxy : {
                        extraParams : {
                            isRecruiting : true
                        }
                    }
                }
            }
        },

        modelValidation : true,

        controller : {
            type : 'criterion_recruiting_jobs_job_form'
        },

        listeners : {
            scope : 'controller',
            tabChange : 'onTabChange'
        },

        minTabWidth : 300,

        bodyPadding : 0,

        defaults : {
            bodyPadding : 0,
            dockedItems : [
                {
                    xtype : 'panel',
                    dock : 'top',
                    header : {
                        bind : {
                            title : {
                                html : '{getPanelHeaderTitle}'
                            }
                        },

                        items : [
                            {
                                xtype : 'toolbar',
                                padding : 0,
                                margin : '0 20 0 0',
                                items : [
                                    {
                                        xtype : 'tbtext',
                                        bind : {
                                            html : '<span>{jobPostingStatus}</span>'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        },

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            }
        ],

        items : [
            {
                xtype : 'criterion_form',
                reference : 'form',
                itemId : 'details',
                title : i18n.gettext('Job Posting'),

                items : [
                    {
                        autoScroll : true,
                        flex : 1,
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,

                                items : [
                                    {
                                        plugins : [
                                            'criterion_responsive_column'
                                        ],
                                        items : [
                                            {
                                                items : [
                                                    {
                                                        xtype : 'criterion_employer_combo',
                                                        fieldLabel : i18n.gettext('Employer'),
                                                        bind : {
                                                            value : '{jobPosting.employerId}',
                                                            readOnly : '{!isPhantom}'
                                                        },
                                                        listeners : {
                                                            change : 'handleEmployerChange'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'fieldcontainer',
                                                        layout : 'hbox',
                                                        margin : '0 0 18 0',
                                                        requiredMark : true,
                                                        fieldLabel : i18n.gettext('Position'),
                                                        items : [
                                                            {
                                                                xtype : 'textfield',
                                                                flex : 1,
                                                                bind : {
                                                                    value : '{jobPosting.position.title}'
                                                                },
                                                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                                                readOnly : true
                                                            },
                                                            {
                                                                xtype : 'button',
                                                                scale : 'small',
                                                                margin : '0 0 0 3',
                                                                cls : 'criterion-btn-light',
                                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                                listeners : {
                                                                    click : 'onPositionSearch'
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        xtype : 'textfield',
                                                        fieldLabel : i18n.gettext('Job Title'),
                                                        bind : '{jobPosting.title}'
                                                    },
                                                    {
                                                        xtype : 'textfield',
                                                        fieldLabel : i18n.gettext('Requisition #'),
                                                        bind : {
                                                            value : '{jobPosting.requisitionCode}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'textfield',
                                                        fieldLabel : i18n.gettext('Location'),
                                                        bind : {
                                                            value : '{jobPosting.location}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'textfield',
                                                        fieldLabel : i18n.gettext('Salary'),
                                                        bind : {
                                                            value : '{jobPosting.salary}'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                items : [
                                                    {
                                                        xtype : 'criterion_code_detail_field',
                                                        fieldLabel : i18n.gettext('Status'),
                                                        codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                                                        bind : {
                                                            value : '{jobPosting.statusCd}'
                                                        },
                                                        editable : false
                                                    },
                                                    {
                                                        xtype : 'datefield',
                                                        fieldLabel : i18n.gettext('Open Date'),
                                                        bind : '{jobPosting.openDate}'
                                                    },
                                                    {
                                                        xtype : 'datefield',
                                                        fieldLabel : i18n.gettext('Internal Open Date'),
                                                        bind : '{jobPosting.internalOpenDate}'
                                                    },

                                                    {
                                                        xtype : 'fieldcontainer',
                                                        fieldLabel : i18n.gettext('Hiring Managers'),
                                                        layout : 'hbox',
                                                        requiredMark : true,
                                                        items : [
                                                            {
                                                                xtype : 'textfield',
                                                                flex : 1,
                                                                bind : {
                                                                    value : '{hiringManagers}'
                                                                },
                                                                allowBlank : false,
                                                                readOnly : true
                                                            },
                                                            {
                                                                xtype : 'button',
                                                                scale : 'small',
                                                                margin : '0 0 0 3',
                                                                cls : 'criterion-btn-light',
                                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                                listeners : {
                                                                    click : 'onManagerSearch'
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        xtype : 'fieldcontainer',
                                                        fieldLabel : i18n.gettext('Recruiter'),
                                                        layout : 'hbox',
                                                        items : [
                                                            {
                                                                xtype : 'textfield',
                                                                flex : 1,
                                                                bind : {
                                                                    value : '{jobPosting.recruiterFullName}'
                                                                },
                                                                readOnly : true
                                                            },
                                                            {
                                                                xtype : 'button',
                                                                scale : 'small',
                                                                margin : '0 0 0 3',
                                                                cls : 'criterion-btn-light',
                                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                                listeners : {
                                                                    click : 'onRecruiterSearch'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },

                            //
                            {
                                xtype : 'component',
                                autoEl : 'hr',
                                cls : 'criterion-horizontal-ruler'
                            },
                            {
                                defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,

                                items : [
                                    {
                                        plugins : [
                                            'criterion_responsive_column'
                                        ],
                                        items : [
                                            {
                                                items : [
                                                    {
                                                        xtype : 'combobox',
                                                        fieldLabel : i18n.gettext('Question Set'),
                                                        displayField : 'name',
                                                        valueField : 'id',
                                                        editable : true,
                                                        name : 'questionSetId',
                                                        forceSelection : true,
                                                        queryMode : 'local',
                                                        autoSelect : true,
                                                        bind : {
                                                            store : '{questionSets}',
                                                            value : '{jobPosting.questionSetId}'
                                                        },
                                                        triggers : {
                                                            clear : {
                                                                type : 'clear',
                                                                cls : 'criterion-clear-trigger',
                                                                hideWhenEmpty : true
                                                            }
                                                        }
                                                    },
                                                    {
                                                        xtype : 'combobox',
                                                        fieldLabel : i18n.gettext('Review Template'),
                                                        bind : {
                                                            value : '{jobPosting.reviewTemplateId}',
                                                            store : '{reviewTemplates}'
                                                        },
                                                        displayField : 'name',
                                                        valueField : 'id',
                                                        editable : true,
                                                        forceSelection : true,
                                                        queryMode : 'local',
                                                        emptyText : i18n.gettext('Not Selected'),
                                                        /* eslint-disable */
                                                        // @formatter:off
                                                        tpl : Ext.create(
                                                            'Ext.XTemplate',
                                                            '<ul class="x-list-plain">',
                                                            '<tpl for=".">',
                                                            '<li role="option" class="x-boundlist-item item-enab-{isActive}">{name}</li>',
                                                            '</tpl>',
                                                            '</ul>'
                                                        )
                                                        // @formatter:on
                                                        /* eslint-enable */
                                                    }
                                                ]
                                            },
                                            {
                                                items : [
                                                    {
                                                        xtype : 'combobox',
                                                        fieldLabel : i18n.gettext('Employment Application'),
                                                        displayField : 'name',
                                                        valueField : 'id',
                                                        editable : true,
                                                        name : 'employmentApplicationWebformId',
                                                        forceSelection : true,
                                                        queryMode : 'local',
                                                        bind : {
                                                            store : '{webForms}',
                                                            value : '{jobPosting.employmentApplicationWebformId}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'toggleslidefield',
                                                        fieldLabel : i18n.gettext('Employment Application in Job Portal'),
                                                        value : false,
                                                        bind : {
                                                            value : '{jobPosting.isShowEaJobPortal}'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },

                            //
                            {
                                xtype : 'component',
                                autoEl : 'hr',
                                cls : 'criterion-horizontal-ruler'
                            },
                            {
                                flex : 1,
                                minHeight : 300,
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        xtype : 'container',
                                        flex : 4,
                                        layout : 'fit',
                                        items : [
                                            {
                                                xtype : 'criterion_htmleditor',
                                                reference : 'description',
                                                enableAlignments : false,
                                                enableLists : false,
                                                enableExtListMenu : true,
                                                fieldLabel : i18n.gettext('Description'),
                                                padding : '20 50 25 25',
                                                bind : {
                                                    value : '{jobPosting.description}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                buttons : [
                    {
                        text : i18n.gettext('Delete'),
                        cls : 'criterion-btn-remove',
                        listeners : {
                            click : 'handleRemoveAction'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'isPhantom ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.RECRUITING_JOB,
                                        actName : criterion.SecurityManager.DELETE,
                                        reverse : true
                                    }
                                ]
                            })
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        listeners : {
                            click : 'onCancel'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Save'),
                        listeners : {
                            click : 'onSubmit'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB, criterion.SecurityManager.UPDATE, true)
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_recruiting_jobs_candidates',
                bind : {
                    title : '{candidatesTitle}'
                },
                reference : 'recruiting_jobs_candidates_grid',
                itemId : 'candidates',
                listeners : {
                    selectCandidate : 'candidateSelect',
                    candidatesChanged : 'onCandidatesChanged'
                },
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_CANDIDATES, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_jobs_position',
                title : i18n.gettext('Position'),
                itemId : 'positionInformation',
                reference : 'positionInformation',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_POSITION, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_recruiting_jobs_publish',
                title : i18n.gettext('Publish'),
                itemId : 'publish',
                reference : 'publish',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_PUBLISH, criterion.SecurityManager.READ)
            }
        ],

        setTabsDisabled : function(disabled) {
            this.getTabBar().items.each(function(item, idx) {
                if (idx > 0) {
                    item.setDisabled(disabled);
                }
            });
        }
    };

});
