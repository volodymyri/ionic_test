Ext.define('criterion.view.settings.payroll.TaxRates', function() {

    return {
        alias : 'widget.criterion_settings_tax_rates',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.Taxes',
            'criterion.controller.settings.payroll.TaxRates',
            'criterion.view.settings.payroll.TaxRateForm'
        ],

        title : i18n.gettext('Tax Rates'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_tax_rates',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            showTitleInConnectedViewMode : true,
            editor : {
                xtype : 'criterion_settings_tax_rate_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                controller : {
                    externalUpdate : false
                }
            }
        },

        viewModel : {
            stores : {
                employerTaxes : {
                    type : 'criterion_employer_taxes'
                }
            }
        },

        bind : {
            store : '{employerTaxes}'
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add Employer Tax'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAdd'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Tax Name'),
                flex : 1,
                dataIndex : 'taxName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Rate'),
                flex : 1,
                dataIndex : 'rate',
                renderer : function(value) {
                    if (value === null) {
                        return '';
                    }

                    return Ext.util.Format.percent(value, '0.####');
                }
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                flex : 1,
                dataIndex : 'effectiveDate'
            }
        ]
    };

});
