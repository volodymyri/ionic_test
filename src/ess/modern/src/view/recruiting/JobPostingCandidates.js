Ext.define('ess.view.recruiting.JobPostingCandidates', function() {

    return {
        alias : 'widget.ess_modern_recruiting_job_posting_candidates',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.recruiting.JobPostingCandidates',
            'criterion.store.employer.jobPosting.Candidates'
        ],

        controller : {
            type : 'ess_modern_recruiting_job_posting_candidates'
        },

        viewModel : {
            data : {
                showInactive : 0
            },

            stores : {
                jobPostingCandidates : {
                    type : 'criterion_job_posting_candidates',
                    proxy : {
                        extraParams : {
                            jobPostingId : '{jobPosting.id}'
                        }
                    },
                    listeners : {
                        load : 'onJobPostingCandidatesLoad'
                    }
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : 'Candidates',
                buttons : [
                    {
                        xtype : 'button',
                        itemId : 'backButton',
                        cls : 'criterion-menubar-back-btn',
                        iconCls : 'md-icon-arrow-back',
                        align : 'left',
                        handler : 'handleBack'
                    }
                ]
            },
            {
                xtype : 'container',
                docked : 'top',
                padding : 5,
                items : [
                    {
                        xtype : 'criterion_combobox',
                        reference : 'showInactiveSelect',
                        cls : 'cb_left_filter',
                        margin : '0 0 0 10',
                        label : i18n.gettext('Show Inactive'),
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : [
                                {
                                    text : i18n.gettext('Yes'), value : 1
                                },
                                {
                                    text : i18n.gettext('No'), value : 0
                                }
                            ]
                        }),
                        clearable : false,
                        displayField : 'text',
                        valueField : 'value',
                        labelAlign : 'left',
                        bind : {
                            value : '{showInactive}'
                        },
                        listeners : {
                            change : 'handleChangeShowInactive'
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',
                reference : 'jpCandidates',
                bind : {
                    store : '{jobPostingCandidates}'
                },

                listeners : {
                    itemtap : function(o, index, target, record) {
                        this.up().getController().showCandidateDetail(record);
                    }
                },

                flex : 1,

                itemConfig : {
                    viewModel : {
                        data : {}
                    }
                },

                columns : [
                    {
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName',
                        width : 150
                    },
                    {
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName',
                        width : 150
                    },
                    {
                        text : i18n.gettext('Location'),
                        dataIndex : 'location',
                        width : 150
                    },
                    {
                        xtype : 'datecolumn',
                        text : 'Applied Date',
                        dataIndex : 'appliedDate',
                        width : 110
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Status'),
                        dataIndex : 'candidateStatusCd',
                        codeDataId : criterion.consts.Dict.CANDIDATE_STATUS,
                        width : 150
                    }
                ]
            }
        ]
    }
});
