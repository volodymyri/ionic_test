Ext.define('criterion.view.settings.hr.onboarding.Details', function() {

    const DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_settings_onboarding_details',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.hr.onboarding.Details',
            'criterion.view.settings.hr.onboarding.Form'
        ],

        controller : {
            type : 'criterion_settings_onboarding_details',
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : false,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_settings_onboarding_form',
                allowDelete : true,
                viewModel : {
                    data : {
                        hideFillForm : true
                    }
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
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
                text : i18n.gettext('Task'),
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
                text : i18n.gettext('Employee Name'),
                dataIndex : 'assignedToEmployeeName',
                flex : 1
            }
        ]

    }
});
