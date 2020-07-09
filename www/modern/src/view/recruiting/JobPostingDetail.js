Ext.define('ess.view.recruiting.JobPostingDetail', function() {

    return {

        alias : 'widget.ess_modern_recruiting_job_posting_detail',

        extend : 'criterion.view.FormView',

        defaults : {
            labelWidth : 150
        },

        cls : 'ess-modern-recruiting-job-posting-detail',

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
                    title : '{record.title}'
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
                        iconCls : 'md-icon-supervisor-account',
                        handler : function() {
                            this.up('ess_modern_recruiting_job_posting_detail').fireEvent('showCandidates');
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_combobox',
                label : i18n.gettext('Employer'),
                store : 'Employers',
                bind : {
                    value : '{record.employerId}'
                },
                readOnly : true,
                valueField : 'id',
                displayField : 'legalName'
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Position'),
                readOnly : true,
                bind : {
                    value : '{record.position.title}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                label : i18n.gettext('Status'),
                readOnly : true,
                codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                bind : {
                    value : '{record.statusCd}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Requisition #'),
                readOnly : true,
                bind : {
                    value : '{record.requisitionCode}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Salary'),
                readOnly : true,
                bind : {
                    value : '{record.salary}'
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
                        html : '<span>Description</span>'
                    },
                    {
                        xtype : 'container',
                        cls : 'descriptionBlock',
                        bind : {
                            html : '{record.description}'
                        }
                    }
                ]
            }

        ]

    }
});
