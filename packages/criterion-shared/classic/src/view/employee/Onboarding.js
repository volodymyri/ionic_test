Ext.define('criterion.view.employee.Onboarding', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_employee_onboarding',

        extend : 'criterion.view.GridView',

        requires : [
            'Ext.grid.feature.Grouping',
            'criterion.store.employee.Onboardings',
            'criterion.controller.employee.Onboarding',
            'criterion.view.common.OnboardingForm'
        ],

        title : i18n.gettext('Onboarding'),

        viewModel : {
            stores : {
                employeeOnboardings : {
                    type : 'criterion_employee_onboardings',
                    grouper : {
                        property : 'onboardingGroupCd',
                        direction : 'ASC'
                    },
                    sorters : [{
                        property : 'sequence',
                        direction : 'ASC'
                    }]
                }
            }
        },

        controller : {
            type : 'criterion_employee_onboarding',
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_common_onboarding_form',
                allowDelete : true,
                controller : {
                    externalUpdate : false,
                    maskOnUpdate : true
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                viewModel : {
                    data : {
                        dueInDays : false
                    }
                }
            }
        },

        bind : {
            store : '{employeeOnboardings}'
        },

        tbar : [
            {
                xtype : 'criterion_splitbutton',
                text : i18n.gettext('Add List'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddList'
                },
                menu : [
                    {
                        text : i18n.gettext('Add Task'),
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ]
            },
            '->',
            {
                xtype: 'button',
                text : i18n.gettext('Notify'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleNotifyClick'
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

        features : [
            {
                ftype : 'grouping',
                startCollapsed : false
            }
        ],

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Group'),
                dataIndex : 'onboardingGroupCd',
                flex : 2,
                codeDataId : DICT.ONBOARDING_GROUP
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'onboardingTaskTypeCd',
                flex : 1,
                codeDataId : DICT.ONBOARDING_TASK_TYPE
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Workflow'),
                dataIndex : 'workflowName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Assigned To'),
                dataIndex : 'assignedToEmployeeName',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Due Date'),
                dataIndex : 'dueDate',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'status',
                flex : 1
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Notified'),
                align : 'center',
                dataIndex : 'notificationSent',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]
    };

});
