Ext.define('criterion.view.payroll.batch.BasePaymentAction', function() {

    return {

        alias : 'widget.criterion_payroll_batch_base_payment_action',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.BasePaymentAction'
        ],

        controller : {
            type : 'criterion_payroll_batch_base_payment_action'
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
                btnTitle : '',
                payrollDeposits : null,
                numberOfPayrolls : null
            }
        },

        title : '',

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
                bind : {
                    text : '{btnTitle}'
                },
                listeners : {
                    click : 'handleAction'
                }
            }
        ],

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH
        },

        bodyPadding : 20,

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Payments Selected'),
                disabled : true,
                bind : {
                    value : '{numberOfPayrolls}'
                }
            }
        ]
    }
});
