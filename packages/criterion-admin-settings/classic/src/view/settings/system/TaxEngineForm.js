Ext.define('criterion.view.settings.system.TaxEngineForm', function() {

    const DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_settings_system_tax_engine_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.TaxEngineForm'
        ],

        controller : {
            type : 'criterion_settings_system_tax_engine_form',
            externalUpdate : false
        },

        bodyPadding : 0,

        title : i18n.gettext('Tax Details'),

        items : [
            {
                xtype : 'criterion_panel',

                bodyPadding : '0 10',

                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
                plugins : [
                    'criterion_responsive_column'
                ],
                defaultType : 'container',

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.COUNTRY,
                                fieldLabel : i18n.gettext('Country'),
                                readOnly : true,
                                bind : {
                                    value : '{countryCd}'
                                }
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Tax Name'),
                                requiredMark : true,
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        readOnly : true,
                                        allowBlank : false,
                                        flex : 1,
                                        bind : '{record.taxName}'
                                    },
                                    {
                                        xtype : 'button',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        cls : 'criterion-btn-primary',
                                        margin : '0 0 0 5',
                                        handler : 'handleTaxSelect'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Effective Date'),
                                allowBlank : false,
                                bind : '{record.effectiveDate}'
                            },
                            {
                                xtype : 'displayfield',
                                fieldLabel : i18n.gettext('Filing Status'),
                                allowBlank : false,
                                bind : '{record.filingStatusDescription}'
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_gridpanel',
                margin : '20 0 0 0',
                reference : 'ratesGrid',
                bind : {
                    store : '{record.rates}'
                },
                style : {
                    'border-top' : '1px solid #e8e8e8 !important'
                },
                tbar : [
                    '->',
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        handler : 'handleAddRate'
                    }
                ],
                listeners : {
                    scope : 'controller',
                    beforecellclick : 'handleEditRate'
                },
                columns : [
                    {
                        text : i18n.gettext('Start Amount'),
                        dataIndex : 'startAmount',
                        renderer : value => {
                            return value === null ? '' : criterion.LocalizationManager.currencyFormatter(value)
                        },
                        flex : 1
                    },
                    {
                        text : i18n.gettext('End Amount'),
                        dataIndex : 'endAmount',
                        renderer : value => {
                            return value === null ? '' : criterion.LocalizationManager.currencyFormatter(value)
                        },
                        flex : 1
                    },
                    {
                        renderer : value => {
                            return value === null ? '' : Ext.util.Format.percent(value, '0.##')
                        },
                        text : i18n.gettext('Rate'),
                        dataIndex : 'rate',
                        flex : 1
                    },
                    {
                        text : i18n.gettext('Amount'),
                        dataIndex : 'amount',
                        renderer : value => {
                            return value === null ? '' : criterion.LocalizationManager.currencyFormatter(value)
                        },
                        flex : 1
                    }
                ]
            }
        ]
    }

});
