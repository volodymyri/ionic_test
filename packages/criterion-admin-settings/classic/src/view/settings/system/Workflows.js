Ext.define('criterion.view.settings.system.Workflows', function() {

    return {
        alias : 'widget.criterion_settings_workflows',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.system.workflow.WorkflowForm',
            'criterion.controller.settings.system.Workflows',
            'criterion.store.Workflows'
        ],

        title : i18n.gettext('Workflows'),

        viewModel : {
            data : {
                showInactive : true
            },
            stores : {
                workflows : {
                    type : 'criterion_workflows',
                    filters : {
                        property : 'isActive',
                        value : ['{!showInactive}', true],
                        operator : 'in'
                    }
                }
            }
        },

        controller : {
            type : 'criterion_settings_workflows',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_workflow_form',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                allowDelete : true,
                controller : {
                    type : 'criterion_settings_workflow_form',
                    externalUpdate : false
                }
            }
        },

        bind : {
            store : '{workflows}'
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            {
                xtype : 'toggleslidefield',
                labelWidth: 100,
                margin: '0 0 0 20',
                bind : '{showInactive}',
                fieldLabel : i18n.gettext('Show inactive')
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
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'workflowTypeCd',
                codeDataId : criterion.consts.Dict.WORKFLOW,
                text : i18n.gettext('Request Type'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                sortParam : 'workflowTypeDescription'
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'employeeGroups',
                flex : 2,
                text : i18n.gettext('Employee Groups'),
                filter : true,
                renderer : function(value) {
                    return Ext.isArray(value) ? value.join(', ') : '';
                }
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Active'),
                dataIndex : 'isActive',
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            }
        ]
    };

});
