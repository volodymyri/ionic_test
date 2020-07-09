Ext.define('criterion.view.settings.hr.TaskGroups', function() {

    return {
        alias : 'widget.criterion_settings_task_groups',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.employer.GridView',
            'criterion.view.settings.hr.TaskGroup',
            'criterion.store.employer.TaskGroups',
            'criterion.store.employer.Tasks'
        ],

        title : i18n.gettext('Task Groups'),

        layout : 'fit',

        controller : {
            type : 'criterion_employer_gridview',
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,

            loadRecordOnEditOptions : {
                params : {
                    activeOnly : true
                }
            },
            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_task_group',
                allowDelete : true
            }
        },

        viewModel : {
            stores : {
                employerTaskGroups : {
                    type : 'criterion_employer_task_groups'
                }
            }
        },

        bind : {
            store : '{employerTaskGroups}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Task Group Name'),
                dataIndex : 'name',
                flex : 1
            }
        ]
    };

});
