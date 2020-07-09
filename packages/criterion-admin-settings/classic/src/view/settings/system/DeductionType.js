Ext.define('criterion.view.settings.system.DeductionType', function() {

    return {

        alias : 'widget.criterion_payroll_settings_system_deduction_type',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.DeductionType'
        ],

        controller : {
            type : 'criterion_payroll_settings_system_deduction_type',
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                hideDelete : function(data) {
                    return data('hideDeleteInt') || data('record.isSystem');
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('Deduction Type Details'),

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
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Code Regular'),
                                disabled : true,
                                minValue : 1100,
                                maxValue : 1999,
                                bind : {
                                    value : '{record.codeRegular}',
                                    disabled : '{record.isSystem}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Code Supplemental'),
                                disabled : true,
                                minValue : 1100,
                                maxValue : 1999,
                                bind : {
                                    value : '{record.codeSupplemental}',
                                    disabled : '{record.isSystem}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                disabled : true,
                                bind : {
                                    value : '{record.plan}',
                                    disabled : '{record.isSystem}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Maximum Amount'),
                                disabled : true,
                                bind : {
                                    value : '{record.maxAmount}',
                                    disabled : '{record.isSystem}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',
                margin : '20 0 0 0',
                reference : 'detailsGrid',
                bind : {
                    store : '{record.taxes}'
                },
                listeners : {
                    removeaction : 'handleRemoveTax'
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
                        handler : 'handleAddTax'
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Tax Name'),
                        dataIndex : 'taxName',
                        sortable : false,
                        menuDisabled : true,
                        flex : 1
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Maximum Amount'),
                        width : 200,
                        dataIndex : 'maxAmount',
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_currencyfield'
                        }
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ]
    }

});
