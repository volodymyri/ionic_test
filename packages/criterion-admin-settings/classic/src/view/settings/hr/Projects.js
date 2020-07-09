Ext.define('criterion.view.settings.hr.Projects', function() {

    return {
        alias : 'widget.criterion_settings_projects',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.employer.GridView',
            'criterion.view.settings.hr.Project',
            'criterion.store.employer.Projects'
        ],

        title : i18n._('Projects'),

        layout : 'fit',

        controller : {
            type : 'criterion_employer_gridview',
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,

            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_project',
                allowDelete : true
            }
        },

        viewModel : {
            stores : {
                employerProjects : {
                    type : 'criterion_employer_projects'
                }
            }
        },

        bind : {
            store : '{employerProjects}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n._('Project Name'),
                dataIndex : 'name',
                flex : 3
            },
            {
                xtype : 'gridcolumn',
                text : i18n._('Project Code'),
                dataIndex : 'code',
                flex : 1
            }
        ]
    };

});
