Ext.define('criterion.view.settings.payroll.TaxRateForm', function() {

    return {

        alias : 'widget.criterion_settings_tax_rate_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.ux.form.PercentageField'
        ],

        title : i18n.gettext('Tax Rate'),

        bodyPadding : 0,

        layout : 'hbox',

        plugins : [
            'criterion_responsive_column'
        ],

        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

        items : [
            {
                items : [
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        name : 'employerId',
                        disabled : true,
                        hideTrigger : true
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Tax Name'),
                        name : 'taxName',
                        readOnly : true
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Tax Identifier'),
                        name : 'taxIdentifier',
                        allowBlank : true
                    },
                    {
                        xtype : 'criterion_percentagefield',
                        fieldLabel : i18n.gettext('Rate'),
                        name : 'rate',
                        decimalPrecision : 6,
                        allowBlank : true
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('Calc Method'),
                        codeDataId : criterion.consts.Dict.TAX_CALC_METHOD,
                        name : 'taxCalcMethodCd',
                        allowBlank : true
                    }
                ]
            },
            {
                items : [
                    {
                        xtype : 'toggleslidefield',
                        name : 'isOverrideTax',
                        fieldLabel : i18n.gettext('Override Tax')
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Round'),
                        name : 'isRounding'
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Recalc'),
                        name : 'isRecalc'
                    },
                    {
                        xtype : 'datefield',
                        fieldLabel : i18n.gettext('Effective Date'),
                        name : 'effectiveDate',
                        allowBlank : false
                    },
                    {
                        xtype : 'criterion_currencyfield',
                        fieldLabel : i18n.gettext('Wage Base'),
                        name : 'wageBase',
                        allowBlank : true
                    }
                ]
            }
        ]
    };

});
