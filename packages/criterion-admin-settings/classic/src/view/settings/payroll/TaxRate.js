Ext.define('criterion.view.settings.payroll.TaxRate', function() {

    return {

        alias : 'widget.criterion_settings_tax_rate',

        extend : 'criterion.view.common.SelectTax',

        requires : [
            'criterion.controller.settings.payroll.TaxRate'
        ],

        controller : {
            type : 'criterion_settings_tax_rate'
        },

        getAdditionalRecordParams : function() {
            return [
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Tax Identifier'),
                    reference : 'taxIdentifierField',
                    allowBlank : true
                },
                {
                    xtype : 'datefield',
                    reference : 'effectiveDateField',
                    allowBlank : false,
                    fieldLabel : i18n.gettext('Effective Date'),
                    listeners : {
                        change : 'onEffectiveDateChange'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    reference : 'isRoundingField',
                    fieldLabel : i18n.gettext('Round'),
                    name : 'isRounding'
                }
            ];
        }
    };

});

