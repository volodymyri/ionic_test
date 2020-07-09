Ext.define('criterion.view.employee.wizard.Onboarding', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_employee_wizard_onboarding',

        extend : 'criterion.view.employee.Onboarding',

        requires : [
            'criterion.controller.employee.wizard.Onboarding',
            'criterion.view.common.OnboardingForm'
        ],

        viewModel : {
            data : {
                readOnly : false
            }
        },

        controller : {
            type : 'criterion_employee_wizard_onboarding',
            loadRecordOnEdit : false,
            connectParentView : false,
            reloadAfterEditorSave : false,
            reloadAfterEditorDelete : false,
            editor : {
                xtype : 'criterion_common_onboarding_form',
                allowDelete : true,
                title : i18n.gettext('Onboarding'),
                controller : {
                    externalUpdate : true // will be saved in external class
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        width : '90%',
                        height : '90%'
                    }
                ],
                viewModel : {
                    data : {
                        dueInDays : false
                    }
                }
            }
        },

        tbar : [
            {
                xtype : 'criterion_splitbutton',
                text : i18n.gettext('Add List'),
                width : 120,
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddList'
                },
                bind : {
                    hidden : '{readOnly}'
                },
                menu : [
                    {
                        text : i18n.gettext('Add Task'),
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ]
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
                text : i18n.gettext('Sequence'),
                dataIndex : 'sequence',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
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
            }
        ]
    }
});
