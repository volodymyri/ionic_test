Ext.define('criterion.view.TaskPicker', {

    extend : 'criterion.view.MultiRecordPickerRemote',

    requires : [
        'criterion.controller.TaskPicker',
        'criterion.store.employer.Tasks'
    ],

    alias : 'widget.criterion_view_task_picker',

    multiSelect : true,

    config : {
        allowTaskNameFilter : true
    },

    viewModel : {
        data : {
            title : i18n.gettext('Select task'),
            isTasksActive : true,
            isTaskGroupsActive : false,
            isProjectsActive : false
        },
        stores : {
            inputStore : Ext.create('criterion.store.employer.Tasks', {
                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                remoteFilter : true,
                remoteSort : true
            })
        },
        formulas : {
            isTextFilter : data => true
        }
    },

    controller : {
        type : 'criterion_task_picker'
    },

    draggable : false,

    initComponent : function() {
        let gridColumns = [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Task Name'),
                dataIndex : 'name',
                flex : 1,
                filter : 'string',
                filterType : criterion.Consts.TASK_FILTER_TYPES.TASK,
                bind : {
                    hidden : '{!isTasksActive}'
                },
                filterCfg : {
                    xtype : 'textfield'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Project'),
                dataIndex : 'projectName',
                flex : 1,
                excludeFromFilters : true,
                bind : {
                    hidden : '{!isTasksActive}'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Task Group Name'),
                dataIndex : 'name',
                flex : 1,
                filter : 'string',
                filterType : criterion.Consts.TASK_FILTER_TYPES.GROUP,
                bind : {
                    hidden : '{!isTaskGroupsActive}'
                },
                filterCfg : {
                    xtype : 'textfield'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Project Name'),
                dataIndex : 'name',
                flex : 1,
                filter : 'string',
                filterType : criterion.Consts.TASK_FILTER_TYPES.PROJECT,
                bind : {
                    hidden : '{!isProjectsActive}'
                },
                filterCfg : {
                    xtype : 'textfield'
                }
            }
        ];

        this.getViewModel().set({
            gridColumns : gridColumns,
            hideFilters : !this.getAllowTaskNameFilter()
        });

        this.callParent(arguments);
    }

});
