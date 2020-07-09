Ext.define('criterion.view.settings.hr.Jobs', function() {

    return {
        alias : 'widget.criterion_settings_jobs',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.Jobs',
            'criterion.view.settings.hr.JobDetails'
        ],

        title : i18n.gettext('Jobs'),

        layout : 'fit',

        reference : 'grid',

        viewModel : {},

        store : {
            type : 'criterion_jobs',
            remoteSort : true,
            remoteFilter : true,
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        controller : {
            type : 'criterion_gridview',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_job_details',
                allowDelete : true
            }
        },

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,

            stateId : 'settingsJobsGrid',
            stateful : true
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                dataIndex : 'description',
                flex : 1
            }
        ]
    };
});
