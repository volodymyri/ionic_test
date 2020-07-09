Ext.define('criterion.view.settings.system.TaxEngineRateForm', function() {

    return {
        alias : 'widget.criterion_settings_system_tax_engine_rate_form',

        extend : 'criterion.view.FormView',

        bodyPadding : 20,

        title : i18n.gettext('Rate Detail'),

        modal : true,
        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                modal : true
            }
        ],

        draggable : true,

        allowDelete : true,

        viewModel : {
            formulas : {
                submitBtnText : function(data) {
                    return data('blockedState') ? i18n.gettext('Please wait...') : i18n.gettext('Ok');
                }
            }
        },

        items : [
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Start Amount'),
                allowBlank : false,
                bind : {
                    value : '{record.startAmount}'
                }
            },
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('End Amount'),
                allowBlank : true,
                bind : {
                    value : '{record.endAmount}'
                }
            },
            {
                xtype : 'criterion_percentagefield',
                fieldLabel : i18n.gettext('Rate'),
                reference : 'rateField',
                name : 'rate',
                decimalPrecision : 6,
                allowBlank : true,
                bind : {
                    value : '{record.rate}'
                }
            },
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Amount'),
                reference : 'amountField',
                allowBlank : true,
                bind : {
                    value : '{record.amount}'
                }
            }
        ]
    };

});
