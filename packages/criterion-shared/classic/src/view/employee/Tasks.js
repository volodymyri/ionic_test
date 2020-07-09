Ext.define('criterion.view.employee.Tasks', function() {

    return {
        alias : 'widget.criterion_employee_tasks',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.employee.Tasks',
            'criterion.view.employee.Task',
            'criterion.store.employee.Tasks',
            'criterion.store.employer.Tasks'
        ],

        title : i18n._('Tasks'),

        viewModel : {
            formulas : {
                percentSum : {
                    bind : {
                        bindTo : '{employeeTasks}',
                        deep : true
                    },
                    get : function(store) {
                        return store && Ext.util.Format.percent(store.sum('totalAllocation') / 100);
                    }
                }
            },
            stores : {
                employeeTasks : {
                    type : 'criterion_employee_tasks'
                }
            }
        },

        bind : {
            store : '{employeeTasks}'
        },

        controller : {
            type : 'criterion_employee_tasks',
            reloadAfterEditorSave : true,
            editor : {
                xtype : 'criterion_employee_task',
                allowDelete : false,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        tbar : [
            {
                xtype : 'button',
                text : i18n._('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAdd',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TASKS, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n._('Show Inactive'),
                reference : 'showInactive',
                listeners : {
                    change : 'handleChangeShowInactive'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n._('Task / Group Name'),
                dataIndex : 'taskName',
                flex : 1,
                sortable : false,
                renderer : (value, metaData, record) => record.get('projectId') ? '*' : value
            },
            {
                xtype : 'booleancolumn',
                text : i18n._('Group'),
                dataIndex : 'taskGroupId',
                align : 'center',
                trueText : '✓',
                falseText : '-',
                width : 120
            },
            {
                xtype : 'gridcolumn',
                text : i18n._('Project'),
                dataIndex : 'projectName',
                flex : 1,
                sortable : false,
                renderer : (value, metaData, record) => record.get('projectId') ? value : (record.get('taskProjectName') || '-')
            },
            {
                xtype : 'booleancolumn',
                text : i18n._('Auto Allocate'),
                dataIndex : 'autoAllocate',
                align : 'center',
                trueText : '✓',
                falseText : '-',
                width : 150
            },
            {
                xtype : 'numbercolumn',
                dataIndex : 'totalAllocation',
                align : 'center',
                width : 200,
                renderer : value => value === null ? '' : Ext.util.Format.percent(value / 100),
                bind : {
                    text : i18n._('Allocation') + ' ({percentSum})'
                }
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'startDate',
                text : i18n._('Start Date'),
                width : 150
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'endDate',
                text : i18n._('End Date'),
                width : 150
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n._('Delete'),
                        action : 'removeaction',
                        permissionAction : (v, cellValues, record, i, k, e, view) => view.lookupViewModel().get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TASKS, criterion.SecurityManager.DELETE, false, true))
                    }
                ]
            }
        ]
    };
});
