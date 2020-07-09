Ext.define('criterion.view.employee.Groups', function() {

    return {

        alias : 'widget.criterion_employee_groups',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.employee.Groups',
            'criterion.store.employeeGroup.ByMembers',
            'criterion.store.EmployeeGroups',
            'criterion.view.employee.Group'
        ],

        controller : {
            type : 'criterion_employee_groups',
            externalUpdate : false,
            connectParentView : false,
            reloadAfterEditorSave : true,
            editor : {
                xtype : 'criterion_employee_group',
                allowDelete : false,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto'
                    }
                ],
                draggable : true,
                modal : true
            }
        },

        viewModel : {
            stores : {
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    proxy : {
                        extraParams : {
                            employerId : '{employee.employerId}'
                        }
                    }
                }
            }
        },

        title : i18n.gettext('Groups'),

        store : {
            type : 'criterion_employee_group_by_members'
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GROUPS, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
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
                text : i18n.gettext('Group'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction',
                        permissionAction : function(v, cellValues, record, i, k, e, view) {
                            var vm = view.up().getViewModel();

                            return !record.get('isDynamic') && vm.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GROUPS, criterion.SecurityManager.DELETE, false, true));
                        }
                    }
                ]
            }
        ]
    };

});
