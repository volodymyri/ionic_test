Ext.define('criterion.view.payroll.batch.PrintCheck', function() {

    let SORT_CHECKS_BY = criterion.Consts.SORT_CHECKS_BY;

    return {

        alias : 'widget.criterion_payroll_batch_print_check',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.PrintCheck'
        ],

        controller : {
            type : 'criterion_payroll_batch_print_check'
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
                payrollDeposits : null,
                payrollsData : null,
                employerBankAccounts : null
            }
        },

        title : i18n.gettext('Print Checks'),

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
                text : i18n.gettext('Print'),
                disabled : true,
                bind : {
                    disabled : '{!bankAccountCombo.selection.nextCheckNo}'
                },

                listeners : {
                    click : 'handlePrintClick'
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
                reference : 'startingCheckNumber',
                fieldLabel : i18n.gettext('Starting Check Number'),
                allowBlank : false,
                bind : {
                    value : '{bankAccountCombo.selection.nextCheckNo}',
                    disabled : '{!bankAccountCombo.selection}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Number of Checks'),
                disabled : true,
                bind : {
                    value : '{payrollsData.numberOfChecks}',
                    hidden : '{!payrollsData.numberOfChecks}'
                }
            },
            {
                xtype : 'combobox',
                reference : 'sortChecksByCombo',
                fieldLabel : i18n.gettext('Sort Checks By'),
                queryMode : 'local',
                editable : false,
                valueField : 'id',
                displayField : 'text',
                allowBlank : false,
                bind : false,
                value : SORT_CHECKS_BY.EMPLOYEE_NAME.id,
                store : new Ext.data.Store({
                    proxy : {
                        type : 'memory'
                    },
                    data : [
                        {
                            id : SORT_CHECKS_BY.EMPLOYEE_NAME.id,
                            text : SORT_CHECKS_BY.EMPLOYEE_NAME.text
                        },
                        {
                            id : SORT_CHECKS_BY.EMPLOYEE_NUMBER.id,
                            text : SORT_CHECKS_BY.EMPLOYEE_NUMBER.text
                        },
                        {
                            id : SORT_CHECKS_BY.WORK_LOCATION_EMPLOYEE_NAME.id,
                            text : SORT_CHECKS_BY.WORK_LOCATION_EMPLOYEE_NAME.text
                        }
                    ]
                })
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Total Amount'),
                disabled : true,
                bind : {
                    value : '{payrollsData.totalChecksAmount:usMoney}',
                    hidden : '{!payrollsData.numberOfChecks}'
                }
            }
        ]
    }
});
