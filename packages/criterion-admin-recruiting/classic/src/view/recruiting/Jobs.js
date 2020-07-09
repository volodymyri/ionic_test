Ext.define('criterion.view.recruiting.Jobs', function() {

    return {
        alias : 'widget.criterion_recruiting_jobs',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.recruiting.Jobs',
            'criterion.view.recruiting.jobs.JobList',
            'criterion.view.recruiting.jobs.JobForm',
            'criterion.view.recruiting.jobs.JobCandidateDetails',
            'Ext.layout.container.Border',
            'Ext.layout.container.Center'
        ],

        viewModel : {},

        controller : {
            type : 'criterion_recruiting_jobs'
        },

        layout : 'fit',
        bodyPadding : 0,

        plugins : {
            ptype : 'criterion_lazyitems',
            items : [
                {
                    xtype : 'criterion_recruiting_jobs_job_form',
                    reference : 'jobForm',
                    listeners : {
                        candidateSelect : 'showDetails'
                    },
                    hidden : true
                },
                {
                    xtype : 'criterion_recruiting_jobs_job_candidate_details',
                    reference : 'jobDetails',
                    hidden : true
                },
                {
                    layout : 'border',
                    reference : 'mainScreen',

                    items : [
                        {
                            xtype : 'panel',
                            region : 'center',
                            layout : 'fit',

                            items : [
                                {
                                    xtype : 'criterion_recruiting_job_list',
                                    reference : 'jobList',
                                    listeners : {
                                        select : 'onJobSelect'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'panel',

                            listeners : {
                                search : 'onSearch'
                            },
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },

                            region : 'west',
                            cls : 'criterion-side-panel',
                            width : 300,
                            scrollable : true,

                            items : [
                                {
                                    layout : 'hbox',
                                    cls : 'criterion-side-field',
                                    padding : '26 20',
                                    items : [
                                        {
                                            xtype : 'button',
                                            width : '100%',
                                            text : i18n.gettext('Add Job'),
                                            textAlign : 'left',
                                            listeners : {
                                                click : 'onJobAdd'
                                            },
                                            cls : 'criterion-btn-side-add',
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB, criterion.SecurityManager.CREATE, true)
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'form',
                                    reference : 'searchForm',

                                    defaults : {
                                        labelWidth : 150,
                                        labelAlign : 'top',
                                        width : '100%',
                                        cls : 'criterion-side-field'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_employer_combo',
                                            fieldLabel : i18n.gettext('Employer'),
                                            name : 'employerId',
                                            allowBlank : true,
                                            listeners : {
                                                change : 'handleSearchComboChange'
                                            },
                                            listConfig : {
                                                cls : 'criterion-side-list',
                                                shadow : false
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Requisition'),
                                            name : 'requisitionCode',
                                            enableKeyEvents : true,
                                            listeners : {
                                                keypress : 'onKeyPress'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Title'),
                                            name : 'title',
                                            enableKeyEvents : true,
                                            listeners : {
                                                keypress : 'onKeyPress'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.gettext('Status'),
                                            codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                                            name : 'statusCd',
                                            listeners : {
                                                change : 'handleSearchComboChange'
                                            },
                                            listConfig : {
                                                cls : 'criterion-side-list',
                                                shadow : false
                                            },
                                            editable : false,
                                            nullValueText : i18n.gettext('All')
                                        }
                                    ]
                                },
                                {
                                    layout : 'hbox',
                                    padding : 20,
                                    items : [
                                        {
                                            flex : 1
                                        },
                                        {
                                            xtype : 'button',
                                            text : i18n.gettext('Search'),
                                            cls : 'criterion-btn-primary',
                                            listeners : {
                                                click : 'onSearch'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

});
