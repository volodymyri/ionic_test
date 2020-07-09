Ext.define('criterion.view.ess.payroll.BankAccount', function () {

    var WORKFLOW_REQUEST_TYPE = criterion.Consts.WORKFLOW_REQUEST_TYPE;

    return {
        alias : 'widget.criterion_selfservice_payroll_bank_account',

        extend : 'criterion.view.person.BankAccount',

        requires : [
            'criterion.controller.ess.payroll.BankAccount'
        ],

        controller : {
            type : 'criterion_selfservice_payroll_bank_account'
        },

        frame : true,

        noButtons : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        viewModel : {
            data : {
                readOnly : true
            },
            formulas : {
                stateCode : function(get) {
                    var wf = get('record.workflowLog');

                    return wf ? wf.get('stateCode') : null;
                },

                isPendingWorkflow : function(get) {
                    var stateCode = get('stateCode');

                    return stateCode && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], stateCode);
                },
                submitBtnText : function(get) {
                    return get('isPendingWorkflow') ? i18n.gettext('Reviewing') : i18n.gettext('Submit');
                },
                hideDelete : function(get) {
                    return get('hideDeleteInt') || get('isPendingWorkflow');
                },
                workflowMessage : function(get) {
                    var record = get('record'),
                        workflowLog = record && Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                        message;

                    if (workflowLog && workflowLog.get('requestType') === WORKFLOW_REQUEST_TYPE.DELETE) {
                        message = i18n.gettext('Record has been recently removed and is pending approval.');
                    } else {
                        message = Ext.util.Format.format(i18n.gettext('<{0}>Highlighted</{0}> fields were recently changed and being reviewed.'), 'span');
                    }

                    return message;
                },
                isDirty : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        return record && record.dirty
                    }
                },
                allowRecallBtn : function(get) {
                    return get('record.canRecall');
                }
            }
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                ui : 'remove',
                listeners : {
                    click : 'handleWorkflowDeleteClick'
                },
                hidden : true,
                bind : {
                    hidden : '{hideDelete}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Recall'),
                ui : 'remove',
                listeners : {
                    click : 'handleRecallRequest'
                },
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
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            ' ',
            {
                xtype : 'button',
                text : i18n.gettext('Submit'),
                listeners : {
                    click : 'handleWorkflowSubmitClick'
                },
                bind : {
                    text : '{submitBtnText}',
                    disabled : '{readOnly}'
                }
            }
        ]
    }
});
