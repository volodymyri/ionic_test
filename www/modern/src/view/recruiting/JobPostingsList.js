Ext.define('ess.view.recruiting.JobPostingsList', function() {

    return {
        alias : 'widget.ess_modern_recruiting_job_postings_list',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.recruiting.JobPostingsList',
            'criterion.store.employer.JobPostings'
        ],

        controller : {
            type : 'ess_modern_recruiting_job_postings_list'
        },

        viewModel : {
            data : {
                statusCd : null
            },

            stores : {
                jobPostings : {
                    type : 'criterion_employer_job_postings',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteSort : true
                }
            }
        },

        listeners : {
            scope : 'controller',
            painted : 'handleActivate'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : 'Job Postings'
            },
            {
                xtype : 'container',
                docked : 'top',
                items : [
                    {
                        xtype : 'criterion_code_detail_select',
                        label : i18n.gettext('Status'),
                        codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                        valueCode : 'OPEN',
                        labelAlign : 'left',
                        cls : 'cb_left_filter',
                        margin : '5 10 5 10',
                        clearable : false,
                        listeners : {
                            change : 'handleChangeStatus'
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_grid',
                reference : 'jpList',
                bind : {
                    store : '{jobPostings}'
                },

                plugins : [
                    {
                        type : 'criterion_pagingtoolbar'
                    },
                    {
                        type : 'columnresizing'
                    }
                ],

                rowLines : true,

                listeners : {
                    itemtap : function(o, index, target, record) {
                        this.up('ess_modern_recruiting_job_postings_list').getController().showDetail(record);
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
                        text : i18n.gettext('Requisition Number'),
                        dataIndex : 'requisitionCode',
                        width : 150
                    },
                    {
                        text : i18n.gettext('Title'),
                        dataIndex : 'title',
                        width : 200
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Department'),
                        dataIndex : 'departmentCd',
                        codeDataId : criterion.consts.Dict.DEPARTMENT,
                        width : 150
                    },
                    {
                        text : i18n.gettext('Location'),
                        width : 150,
                        renderer : function(value, record) {
                            var position = record.getPosition();

                            return position ? position.get('employerLocationDescription') : '';
                        }
                    },
                    {
                        text : i18n.gettext('Days Open'),
                        dataIndex : 'daysOpen',
                        width : 150
                    },
                    {
                        text : i18n.gettext('Candidates'),
                        dataIndex : 'candidatesCount',
                        width : 150
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Status'),
                        dataIndex : 'statusCd',
                        codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                        width : 150
                    }
                ]
            }
        ]
    }
});
