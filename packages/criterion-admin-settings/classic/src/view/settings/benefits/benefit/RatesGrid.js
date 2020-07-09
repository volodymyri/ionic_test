Ext.define('criterion.view.settings.benefits.benefit.RatesGrid', function() {

    return {
        alias : 'widget.criterion_settings_benefit_rates_grid',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.benefits.benefit.RatesGrid',
            'criterion.store.employer.benefit.Rates'
        ],

        controller : {
            type : 'criterion_settings_benefit_rates_grid'
        },

        viewModel : {
            data : {
                ratePrecision : Ext.util.Format.currencyPrecision
            }
        },

        rowEditing : true,

        store : {
            type : 'employer_benefit_option_rates'
        },

        tbar : [
            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Effective Date'),
                reference : 'effectiveDateCombo',
                store : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'text',
                            type : 'string'
                        },
                        {
                            name : 'value',
                            type : 'date',
                            dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
                        }
                    ],
                    sorters : 'value'
                },
                displayField : 'text',
                valueField : 'value',
                allowBlank : true,
                submitValue : false,
                editable : false,
                forceSelection : true,
                sortByDisplayField : false,
                queryMode : 'local',
                listeners : {
                    change : 'handleEffectiveDateComboChange'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('New Rates'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddRates'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Delete Rates'),
                cls : 'criterion-btn-remove',
                bind : {
                    disabled : '{!effectiveDateCombo.selection}'
                },
                listeners : {
                    click : 'handleDeleteRates'
                }
            },
            '->',
            {
                xtype : 'filebutton',
                text : i18n.gettext('Import'),
                cls : 'criterion-btn-feature',
                bind : {
                    disabled : '{!effectiveDateCombo.selection}'
                },
                listeners : {
                    change : 'handleFileUpload'
                }
            },
            {
                xtype : 'button',
                glyph : criterion.consts.Glyph['ios7-cloud-download'],
                tooltip : i18n.gettext('Download Template'),
                cls : 'criterion-btn-primary',
                handler : 'handleDownloadTemplate'
            },
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                bind : {
                    disabled : '{!effectiveDateCombo.selection}'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'rateCode',
                flex : 1,
                editor : {
                    xtype : 'textfield'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                dataIndex : 'rateDescription',
                flex : 1,
                editor : {
                    xtype : 'textfield'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Tier'),
                dataIndex : 'tier',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                editor : {
                    xtype : 'numberfield'
                }
            },
            {
                // This rate can be a multiplier not a currency
                xtype : 'gridcolumn',
                text : i18n.gettext('Rate'),
                dataIndex : 'value',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                renderer : function(value) {
                    return Ext.util.Format.employerRatePrecision(value);
                },
                editor : {
                    xtype : 'numberfield',
                    bind : {
                        decimalPrecision : '{ratePrecision}'
                    },
                    setDecimalPrecision : function(value) {
                        this.decimalPrecision = value;
                    }
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                sortable : false,
                menuDisabled : true,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        text : '',
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };

});