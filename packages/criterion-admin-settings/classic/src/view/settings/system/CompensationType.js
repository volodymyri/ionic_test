Ext.define('criterion.view.settings.system.CompensationType', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_payroll_settings_system_compensation_type',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.CompensationType'
        ],

        controller : {
            type : 'criterion_payroll_settings_system_compensation_type',
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

        title : i18n.gettext('Compensation Type Details'),

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
                                fieldLabel : i18n.gettext('Code'),
                                disabled : true,
                                minValue : 1100,
                                maxValue : 1999,
                                bind : {
                                    value : '{record.code}',
                                    disabled : '{record.isSystem}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                disabled : true,
                                bind : {
                                    value : '{record.compensationType}',
                                    disabled : '{record.isSystem}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.COMP_TYPE_CD,
                                fieldLabel : i18n.gettext('Type'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.compTypeCd}',
                                    disabled : '{record.isSystem}',
                                    hidden : '{record.isSystem}'
                                },
                                name : 'compTypeCd',
                                allowBlank : false
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
                        text : i18n.gettext('Name'),
                        dataIndex : 'taxName',
                        sortable : false,
                        menuDisabled : true,
                        flex : 1
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Type'),
                        flex : 1,
                        dataIndex : 'compTypeCd',
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.COMP_TYPE_CD
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
