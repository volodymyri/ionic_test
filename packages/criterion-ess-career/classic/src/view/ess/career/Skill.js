Ext.define('criterion.view.ess.career.Skill', function() {

    return {

        alias : 'widget.criterion_selfservice_career_skill',

        extend : 'criterion.view.person.Skill',

        requires : [
            'criterion.controller.ess.career.Skill',
            'criterion.vm.workflow.Base'
        ],

        controller : {
            type : 'criterion_selfservice_career_skill'
        },

        noButtons : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        viewModel : {
            type : 'criterion_workflow_base'
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                ui : 'remove',
                handler : 'handleWorkflowDelete',
                hidden : true,
                bind : {
                    hidden : '{hideDeleteBtn}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Recall'),
                ui : 'remove',
                handler : 'handleRecallRequest',
                hidden : true,
                bind : {
                    hidden : '{!allowRecallBtn}'
                }
            },
            ' ',
            {
                xtype : 'component',
                cls : 'criterion-profile-pending-changes-tooltip',
                hidden : true,
                bind : {
                    hidden : '{!isPendingWorkflow}',
                    html : '{workflowMessage}'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'handleCancelClick'
            },
            ' ',
            {
                xtype : 'button',
                text : i18n.gettext('Submit'),
                handler : 'handleWorkflowSubmit',
                bind : {
                    text : '{submitText}',
                    disabled : '{readOnly}'
                }
            }
        ]
    }
});
