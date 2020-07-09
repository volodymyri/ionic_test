Ext.define('criterion.view.ess.performance.Goal', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {
        alias : 'widget.criterion_selfservice_performance_goal',

        extend : 'criterion.view.person.Goal',

        requires : [
            'criterion.controller.ess.performance.Goal'
        ],

        header : {
            title : i18n.gettext('Goal')
        },

        frame : true,

        bodyPadding : 20,

        padding : '0 25 10 25',

        controller : {
            type : 'criterion_selfservice_performance_goal'
        },

        viewModel : {
            formulas : {
                isPendingWorkflow : get => {
                    let record = get('record'),
                        workflowLog = record && record.getWorkflowLog(),
                        stateCode = workflowLog && workflowLog.get('stateCode');

                    return stateCode && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], stateCode);
                },

                hideDelete : get => get('hideDeleteInt') || get('isPendingWorkflow'),

                workflowMessage : get => {
                    let record = get('record'),
                        workflowLog = record && record.getWorkflowLog(),
                        message;

                    if (workflowLog && workflowLog.get('requestType') === criterion.Consts.WORKFLOW_REQUEST_TYPE.DELETE) {
                        message = i18n.gettext('Record has been recently removed and is pending approval.');
                    } else {
                        message = Ext.util.Format.format('<{0}>{1}</{0}> {2}', 'span', i18n.gettext('Highlighted'), i18n.gettext('fields were recently changed and being reviewed.'));
                    }

                    return message;
                },

                workflowAllowBlank : data => false
            }
        },

        noButtons : true,

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                ui : 'remove',
                listeners : {
                    click : 'handleDeleteClick'
                },
                hidden : true,
                bind : {
                    hidden : '{hideDelete}'
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
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            ' ',
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                listeners : {
                    click : 'handleSubmitClick'
                },
                bind : {
                    disabled : '{readOnly}'
                }
            }
        ]

    }
});
