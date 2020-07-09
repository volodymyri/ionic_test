Ext.define('criterion.view.payroll.batch.TransmitToPTSC', function() {

    return {

        alias : 'widget.criterion_payroll_batch_transmit_to_ptsc',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.TransmitToPTSC'
        ],

        controller : {
            type : 'criterion_payroll_batch_transmit_to_ptsc'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        draggable : true,

        viewModel : {
            data : {
                batchRecord : null,
                summaryData : null
            }
        },

        title : i18n.gettext('Transmit to PTSC'),

        buttons : [
            '->',
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Transmit'),
                listeners : {
                    click : 'handleTransmit'
                }
            }
        ],

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH
        },

        bodyPadding : 30,

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Check Payments'),
                disabled : true,
                bind : {
                    value : '{summaryData.numberOfChecks:number("0")}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Amount (Checks)'),
                disabled : true,
                bind : {
                    value : '{summaryData.totalChecksAmount:usMoney}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('ACH Payments'),
                disabled : true,
                bind : {
                    value : '{summaryData.numberOfDeposits:number("0")}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Amount (ACH)'),
                disabled : true,
                bind : {
                    value : '{summaryData.totalDepositsAmount:usMoney}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Amount (Tax Filing)'),
                disabled : true,
                bind : {
                    value : '{summaryData.totalTaxes:usMoney}'
                }
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Total Amount'),
                disabled : true,
                bind : {
                    value : '{summaryData.totalCost:usMoney}'
                }
            }
        ]
    }
});
