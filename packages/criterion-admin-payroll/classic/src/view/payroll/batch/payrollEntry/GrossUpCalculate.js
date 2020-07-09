Ext.define('criterion.view.payroll.batch.payrollEntry.GrossUpCalculate', function() {

    return {
        alias : 'widget.criterion_payroll_batch_payroll_entry_gross_up_calculate',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.payrollEntry.GrossUpCalculate'
        ],

        controller : {
            type : 'criterion_payroll_batch_payroll_entry_gross_up_calculate'
        },

        title : i18n.gettext('Income Gross Up'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        closable : true,
        modal : true,
        autoScroll : true,

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Gross Up'),
                scale : 'small',
                handler : 'handleCalculate'
            }
        ],

        viewModel : {
            data : {
                incomesStore : null,
                payrollId : null
            }
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_form',
                    reference : 'form',
                    items : [
                        {
                            xtype : 'criterion_currencyfield',
                            reference : 'amount',
                            fieldLabel : i18n.gettext('Desired Net'),
                            allowBlank : false,
                            labelAlign : 'top'
                        },
                        {
                            xtype : 'combobox',
                            bind : {
                                store : '{incomesStore}'
                            },
                            reference : 'income',
                            fieldLabel : i18n.gettext('Income to Gross Up'),
                            displayField : 'name',
                            valueField : 'id',
                            queryMode : 'local',
                            allowBlank : false,
                            labelAlign : 'top'
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };
});

