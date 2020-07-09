Ext.define('criterion.view.recruiting.jobs.JobList', function() {

    return {
        alias : 'widget.criterion_recruiting_job_list',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.recruiting.jobs.JobList',
            'criterion.store.employer.JobPostings',
            'criterion.store.employer.WorkLocations',

            'Ext.grid.filters.Filters',
            'criterion.ux.grid.filters.filter.CodeData',
            'criterion.ux.grid.filters.filter.Employer'
        ],

        viewModel : {
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                }
            }
        },

        controller : {
            type : 'criterion_recruiting_job_list'
        },

        plugins : [
            'gridfilters'
        ],

        stateId : 'recruiting_jobs_JobList',
        stateful : true,

        store : {
            type : 'criterion_employer_job_postings',
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
            remoteFilter : true,
            remoteSort : true
        },

        tbar : [
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Import'),
                cls : 'criterion-btn-feature',
                handler : 'handleImportClick'
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                handler : 'handleRefreshClick'
            }
        ],

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Requisition #'),
                dataIndex : 'requisitionCode',
                width : 150,
                filter : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Title'),
                flex : 1,
                dataIndex : 'title',
                filter : false
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
                dataIndex : 'location',
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
                filter : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                flex : 1,
                dataIndex : 'employerId',
                renderer : function(value) {
                    var employersStore = Ext.StoreManager.lookup('Employers'),
                        employerRec = employersStore ? employersStore.getById(value) : null;

                    return employerRec ? employerRec.get('legalName') : '';
                },
                filter : false
            }
        ]
    };

});
