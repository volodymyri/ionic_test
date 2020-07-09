Ext.define('criterion.view.payroll.batch.GenerateBase', function() {

    return {

        alias : 'widget.criterion_payroll_batch_generate_base',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.GenerateBase'
        ],

        listeners : {
            show : 'handleShow'
        },

        controller : {
            type : 'criterion_payroll_batch_generate_base'
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
                title : i18n.gettext('Generate Ceridian Check'),
                countPaymentsTitle : i18n.gettext('Payments'),

                numberOfPayments : 0,
                totalAmount : 0,
                employerBankAccounts : null
            }
        },

        bind : {
            title : '{title}'
        },

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
                text : i18n.gettext('Generate'),
                disabled : true,
                bind : {
                    disabled : '{!bankAccountCombo.selection}'
                },
                listeners : {
                    click : 'handleGenerate'
                }
            }
        ],

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH
        },

        bodyPadding : 20,

        items : [
            {
                xtype : 'combo',
                reference : 'bankAccountCombo',
                fieldLabel : i18n.gettext('Bank Account'),
                bind : {
                    store : '{employerBankAccounts}'
                },
                displayField : 'name',
                valueField : 'id',
                queryMode : 'local',
                allowBlank : false,
                editable : false
            },
            {
                xtype : 'textfield',
                disabled : true,
                bind : {
                    value : '{numberOfPayments}',
                    fieldLabel : '{countPaymentsTitle}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Total Amount'),
                disabled : true,
                bind : {
                    value : '{totalAmount:currency}'
                }
            }
        ]
    }
});
