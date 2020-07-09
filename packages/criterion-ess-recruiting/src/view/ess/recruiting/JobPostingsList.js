Ext.define('criterion.view.ess.recruiting.JobPostingsList', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_job_postings_list',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.ess.recruiting.JobPostingsList',
            'criterion.store.employer.JobPostings',
            'criterion.store.employer.WorkLocations',
            'criterion.ux.toolbar.ToolbarPaging'
        ],

        viewModel : {
            stores : {
                jobPostings : {
                    type : 'criterion_employer_job_postings',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteSort : true,
                    proxy : {
                        extraParams : {
                            hiringManagerId : '{employeeId}',
                            statusCd : '{statusCd}'
                        }
                    }
                },
                employerWorkLocations : {
                    type : 'employer_work_locations'
                }
            }
        },

        controller : {
            type : 'criterion_selfservice_recruiting_job_postings_list'
        },

        bind : {
            store : '{jobPostings}'
        },

        frame : true,

        header : {

            title : i18n.gettext('Job Postings'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'criterion_code_detail_field',
                    reference : 'statusFilter',
                    fieldLabel : i18n.gettext('Status'),
                    labelWidth : 60,
                    width : 200,
                    codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                    valueCode : 'OPEN',
                    bind : '{statusCd}',
                    listeners : {
                        change : 'handleChangeStatus'
                    }
                }
            ]
        },

        tbar : null,

        dockedItems : [
            {
                xtype : 'criterion_toolbar_paging',
                dock : 'bottom',
                displayInfo : true,
                bind : {
                    store : '{jobPostings}'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Requisition Number'),
                dataIndex : 'requisitionCode',
                width : 150,
                filter : true
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Title'),
                flex : 1,
                dataIndex : 'title',
                filter : true
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Department'),
                flex : 1,
                dataIndex : 'departmentCd',
                codeDataId : criterion.consts.Dict.DEPARTMENT,
                filter : {
                    type : 'codedata'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'employerWorkLocationId',
                renderer : function(value) {
                    var store = this.getViewModel().getStore('employerWorkLocations'),
                        record = store && store.isStore ? store.getById(value) : null;

                    return record ? record.getWorkLocation().get('description') : '';
                },
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Days Open'),
                dataIndex : 'daysOpen',
                width : 150
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Candidates'),
                dataIndex : 'candidatesCount',
                width : 150
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Status'),
                flex : 1,
                dataIndex : 'statusCd',
                codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                filter : {
                    type : 'codedata'
                }
            }
        ]
    };

});
