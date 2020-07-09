Ext.define('criterion.view.recruiting.Candidates', function() {

    const CANDIDATE_SEARCH_APPLIED_CUSTOM_DATE_RANGE = 'CustomDateRange';

    return {

        alias : 'widget.criterion_recruiting_candidates',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.recruiting.Candidates',
            'criterion.store.Candidates',
            'criterion.view.recruiting.candidate.CandidateForm',
            'criterion.ux.grid.PanelExtended',
            'criterion.view.recruiting.candidate.Viewer',
            'criterion.view.recruiting.jobs.JobCandidateDetails',
            'Ext.layout.container.Border',
            'Ext.grid.filters.Filters',
            'criterion.store.employer.jobPosting.candidates.Grid'
        ],

        viewModel : {
            formulas : {
                showCustomDates : data => data('applied') === CANDIDATE_SEARCH_APPLIED_CUSTOM_DATE_RANGE
            },

            stores : {
                candidatesGrid : {
                    type : 'criterion_job_posting_candidates_grid'
                }
            }
        },

        controller : {
            type : 'criterion_recruiting_candidates'
        },

        layout : 'card',
        bodyPadding : 0,

        plugins : {
            ptype : 'criterion_lazyitems',

            items : [
                {
                    layout : 'border',
                    reference : 'candidateList',

                    items : [
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
                            width : 350,
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
                                            text : i18n.gettext('Add Candidate'),
                                            textAlign : 'left',
                                            handler : 'handleCandidateAdd',
                                            cls : 'criterion-btn-side-add',
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE, criterion.SecurityManager.CREATE, true)
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
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Name'),
                                            name : 'name',
                                            enableKeyEvents : true,
                                            listeners : {
                                                keypress : 'onKeyPress'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Skills / Keywords'),
                                            name : 'skillKeywords',
                                            enableKeyEvents : true,
                                            listeners : {
                                                keypress : 'onKeyPress'
                                            }
                                        },
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n.gettext('Last Applied'),
                                            name : 'applied',
                                            reference : 'appliedField',
                                            store : Ext.create('Ext.data.Store', {
                                                fields : ['text', 'value', 'sequence'],
                                                sorters : [
                                                    {
                                                        property : 'sequence',
                                                        direction : 'ASC'
                                                    }
                                                ],
                                                data : [
                                                    {
                                                        sequence : 0,
                                                        value : '',
                                                        text : i18n.gettext('All')
                                                    },
                                                    {
                                                        sequence : 1,
                                                        value : 'WithinLastDay',
                                                        text : i18n.gettext('Within Last Day')
                                                    },
                                                    {
                                                        sequence : 2,
                                                        value : 'WithinLastWeek',
                                                        text : i18n.gettext('Within Last Week')
                                                    },
                                                    {
                                                        sequence : 3,
                                                        value : 'WithinLastMonth',
                                                        text : i18n.gettext('Within Last Month')
                                                    },
                                                    {
                                                        sequence : 4,
                                                        value : CANDIDATE_SEARCH_APPLIED_CUSTOM_DATE_RANGE,
                                                        text : i18n.gettext('Custom Date Range')
                                                    }
                                                ]
                                            }),
                                            valueField : 'value',
                                            listeners : {
                                                change : 'handleSearchAppliedComboChange'
                                            },
                                            listConfig : {
                                                cls : 'criterion-side-list',
                                                shadow : false
                                            },
                                            bind : '{applied}',
                                            allowBlank : true,
                                            editable : false,
                                            value : ''
                                        },
                                        // customs dates
                                        {
                                            layout : 'hbox',
                                            defaults : {
                                                labelWidth : 150,
                                                labelAlign : 'top',
                                                cls : ''
                                            },
                                            flex : 1,
                                            hidden : true,
                                            bind : {
                                                hidden : '{!showCustomDates}'
                                            },
                                            cls : 'criterion-side-field',
                                            items : [
                                                {
                                                    xtype : 'datefield',
                                                    reference : 'appliedStartDateField',
                                                    margin : '10 0 0 0',
                                                    flex : 1,
                                                    submitFormat : criterion.consts.Api.DATE_FORMAT,
                                                    name : 'appliedStartDate',
                                                    disabled : true,
                                                    allowBlank : false,
                                                    bind : {
                                                        disabled : '{!showCustomDates}'
                                                    },
                                                    listeners : {
                                                        change : 'handleSearchAppliedDateChange'
                                                    }
                                                },
                                                {
                                                    xtype : 'component',
                                                    html : i18n.gettext('TO'),
                                                    margin : '20 5 0 5',
                                                    cls : 'custom-label'
                                                },
                                                {
                                                    xtype : 'datefield',
                                                    reference : 'appliedEndDateField',
                                                    margin : '10 0 0 0',
                                                    flex : 1,
                                                    submitFormat : criterion.consts.Api.DATE_FORMAT,
                                                    name : 'appliedEndDate',
                                                    disabled : true,
                                                    allowBlank : false,
                                                    bind : {
                                                        disabled : '{!showCustomDates}'
                                                    },
                                                    listeners : {
                                                        change : 'handleSearchAppliedDateChange'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n.gettext('Status'),
                                            name : 'isActive',
                                            store : Ext.create('Ext.data.Store', {
                                                fields : ['text', 'value', 'sequence'],
                                                sorters : [
                                                    {
                                                        property : 'sequence',
                                                        direction : 'ASC'
                                                    }
                                                ],
                                                data : [
                                                    {
                                                        sequence : 0,
                                                        value : null,
                                                        text : i18n.gettext('All')
                                                    },
                                                    {
                                                        sequence : 1,
                                                        value : 'true',
                                                        text : i18n.gettext('Active')
                                                    },
                                                    {
                                                        sequence : 2,
                                                        value : 'false',
                                                        text : i18n.gettext('Inactive')
                                                    }
                                                ]
                                            }),
                                            valueField : 'value',
                                            listeners : {
                                                change : 'handleSearchComboChange'
                                            },
                                            listConfig : {
                                                cls : 'criterion-side-list',
                                                shadow : false
                                            },
                                            allowBlank : true,
                                            editable : false,
                                            value : true
                                        },
                                        {
                                            xtype : 'checkboxfield',
                                            fieldLabel : i18n.gettext('Advanced'),
                                            cls : 'criterion-side-field advanced-switcher',
                                            name : 'showAdvanced',
                                            bind : '{showAdvanced}'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Job Titles'),
                                            name : 'jobTitles',
                                            enableKeyEvents : true,
                                            hidden : true,
                                            bind : {
                                                hidden : '{!showAdvanced}',
                                                disabled : '{!showAdvanced}'
                                            },
                                            listeners : {
                                                keypress : 'onKeyPress'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Companies'),
                                            name : 'companies',
                                            enableKeyEvents : true,
                                            hidden : true,
                                            bind : {
                                                hidden : '{!showAdvanced}',
                                                disabled : '{!showAdvanced}'
                                            },
                                            listeners : {
                                                keypress : 'onKeyPress'
                                            }
                                        },
                                        {
                                            layout : 'hbox',
                                            defaults : {
                                                labelWidth : 150,
                                                labelAlign : 'top',
                                                width : '100%',
                                                cls : ''
                                            },
                                            flex : 1,
                                            cls : 'criterion-side-field',
                                            hidden : true,
                                            bind : {
                                                hidden : '{!showAdvanced}'
                                            },
                                            items : [
                                                {
                                                    xtype : 'textfield',
                                                    fieldLabel : i18n.gettext('Location'),
                                                    name : 'locationAddress',
                                                    enableKeyEvents : true,
                                                    listeners : {
                                                        keypress : 'onKeyPress'
                                                    },
                                                    bind : {
                                                        disabled : '{!showAdvanced}'
                                                    },
                                                    flex : 1
                                                },
                                                {
                                                    xtype : 'combobox',
                                                    fieldLabel : i18n.gettext(' '),
                                                    name : 'locationDistance',
                                                    store : Ext.create('Ext.data.Store', {
                                                        fields : ['id', 'text'],
                                                        data : [
                                                            {value : 0, text : i18n.gettext('Exact')},
                                                            {value : 5, text : i18n.gettext('5 Miles')},
                                                            {value : 10, text : i18n.gettext('10 Miles')},
                                                            {value : 15, text : i18n.gettext('15 Miles')}
                                                        ]
                                                    }),
                                                    width : 120,
                                                    value : 0,
                                                    listConfig : {
                                                        cls : 'criterion-side-list',
                                                        shadow : false
                                                    },
                                                    bind : {
                                                        disabled : '{!showAdvanced}'
                                                    },
                                                    sortByDisplayField : false,
                                                    displayField : 'text',
                                                    valueField : 'value',
                                                    queryMode : 'local',
                                                    forceSelection : true,
                                                    autoSelect : true,
                                                    editable : false
                                                }
                                            ]
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
                        },
                        {
                            xtype : 'panel',
                            region : 'center',
                            bodyPadding : 0,
                            layout : 'fit',

                            items : [
                                {
                                    xtype : 'criterion_gridpanel_extended',

                                    reference : 'gridCandidates',
                                    rowEditing : false,
                                    useDefaultActionColumn : false,
                                    useDefaultTbar : false,

                                    plugins : [
                                        'gridfilters'
                                    ],

                                    stateId : 'recruiting_candidates',
                                    stateful : true,

                                    store : {
                                        type : 'criterion_candidates',
                                        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                                        remoteFilter : true,
                                        remoteSort : true,
                                        proxy : {
                                            extraParams : {
                                                isActive : true
                                            }
                                        }
                                    },

                                    listeners : {
                                        editaction : 'onRecordEdit',
                                        showResume : 'showResume',
                                        sendEmail : 'sendEmail'
                                    },

                                    dockedItems : {
                                        xtype : 'criterion_toolbar_paging',
                                        dock : 'bottom',
                                        displayInfo : true
                                    },

                                    columns : [
                                        {
                                            xtype : 'gridcolumn',
                                            text : i18n.gettext('First Name'),
                                            dataIndex : 'firstName',
                                            flex : 1,
                                            filter : false
                                        },
                                        {
                                            xtype : 'gridcolumn',
                                            text : i18n.gettext('Last Name'),
                                            dataIndex : 'lastName',
                                            flex : 1,
                                            filter : false
                                        },
                                        {
                                            xtype : 'gridcolumn',
                                            text : i18n.gettext('Jobs Applied'),
                                            dataIndex : 'jobsApplied',
                                            flex : 1
                                        },
                                        {
                                            xtype : 'datecolumn',
                                            text : i18n.gettext('Last Applied'),
                                            dataIndex : 'appliedDate',
                                            flex : 1
                                        },
                                        {
                                            xtype : 'booleancolumn',
                                            dataIndex : 'isActive',
                                            text : i18n.gettext('Status'),
                                            trueText : i18n.gettext('Active'),
                                            falseText : i18n.gettext('Inactive'),
                                            flex : 1,
                                            filter : false
                                        },
                                        {
                                            dataIndex : 'homePhoneUS',
                                            text : i18n.gettext('Phone'),
                                            sortable : false,
                                            flex : 1
                                        },
                                        {
                                            xtype : 'criterion_actioncolumn',
                                            items : [
                                                {
                                                    glyph : criterion.consts.Glyph['document'],
                                                    tooltip : i18n.gettext('Show Resume'),
                                                    action : 'showResume',
                                                    isActionDisabled : (a, b, c, d, record) => !record.get('hasResume')
                                                },
                                                {
                                                    glyph : criterion.consts.Glyph['ios7-email-outline'],
                                                    tooltip : i18n.gettext('Write Email'),
                                                    action : 'sendEmail'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                // new candidate form
                {
                    xtype : 'criterion_recruiting_candidate_demographics_form',
                    title : i18n.gettext('Add Candidate'),
                    reference : 'newCandidateForm',
                    allowDelete : false,

                    controller : {
                        closeFormAfterCancel : false,
                        closeFormAfterSave : false,
                        closeFormAfterDelete : false
                    }
                },
                // candidate details
                {
                    xtype : 'criterion_recruiting_candidate_details',
                    reference : 'candidateDetails'
                },
                // resume viewer
                {
                    xtype : 'criterion_recruiting_candidate_viewer',
                    reference : 'viewer',
                    listeners : {
                        beforeclose : 'onViewerClose'
                    },
                    layout : 'fit'
                }
            ]
        }
    };

});
