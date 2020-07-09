Ext.define('criterion.view.ess.payroll.Tax', {

    alias : 'widget.criterion_selfservice_payroll_tax',

    extend : 'criterion.view.employee.Tax',

    requires : [
        'criterion.controller.ess.payroll.Tax',
        'criterion.ux.button.Back',
        'criterion.ux.button.Next'
    ],

    controller : {
        type : 'criterion_selfservice_payroll_tax'
    },

    frame : true,

    noButtons : true,

    bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

    viewModel : {
        data : {
            readOnly : true,

            records : [],
            currentRecordIndex : 0
        },
        formulas : {
            stateCode : function(get) {
                let wf = get('record.workflowLog');

                return wf ? wf.get('stateCode') : null;
            },

            isPendingWorkflow : function(get) {
                let stateCode = get('stateCode');

                return stateCode && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], stateCode);
            },

            notAllowDelete : data => data('isNotLastTax') || data('isPendingWorkflow'),
            notAllowExpire : data => data('isNotLastTax') || !!data('record.expirationDate') || data('isPendingWorkflow'),

            submitBtnText : function(get) {
                return get('isPendingWorkflow') ? i18n.gettext('Reviewing') : i18n.gettext('Submit');
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
        {
            xtype : 'component',
            margin : '0 0 0 20',
            cls : 'criterion-profile-pending-changes-tooltip',
            html : Ext.util.Format.format(i18n.gettext('<{0}>Highlighted</{0}> fields were recently changed and being reviewed.'), 'span'),
            hidden : true,
            bind : {
                hidden : '{!isPendingWorkflow}'
            }
        },
        {
            xtype : 'button',
            reference : 'delete',
            text : i18n.gettext('Delete'),
            ui : 'remove',
            listeners : {
                click : 'handleDeleteClick'
            },
            hidden : true,
            bind : {
                hidden : '{notAllowDelete}'
            }
        },
        {
            xtype : 'button',
            text : i18n.gettext('Expire'),
            ui : 'feature',
            listeners : {
                click : 'handleExpireTax'
            },
            hidden : true,
            bind : {
                hidden : '{notAllowExpire}'
            },
            margin : '0 0 0 10'
        },
        '->',
        {
            xtype : 'button',
            text : i18n.gettext('Cancel'),
            ui : 'secondary',
            listeners : {
                click : 'handleCancelClick'
            }
        },
        {
            xtype : 'criterion_button_back',
            reference : 'prev',
            text : i18n.gettext('Prev'),
            listeners : {
                click : 'handlePrevClick'
            },
            hidden : true,
            bind : {
                visible : '{currentRecordIndex > 0}'
            }
        },
        {
            xtype : 'criterion_button_next',
            reference : 'next',
            iconAlign : 'right',
            listeners : {
                click : 'handleNextClick'
            },
            hidden : true,
            bind : {
                visible : '{currentRecordIndex < records.length - 1}'
            }
        },
        {
            xtype : 'button',
            text : i18n.gettext('Submit'),
            ui : 'feature',
            listeners : {
                click : 'handleSubmitClick'
            },
            bind : {
                text : '{submitBtnText}',
                disabled : '{readOnly}'
            }
        }
    ]
});
