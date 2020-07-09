Ext.define('criterion.view.settings.system.deductionType.TaxSelect', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_payroll_settings_system_deduction_type_tax_select',

        extend : 'criterion.view.MultiRecordPickerRemote',

        requires : [
            'criterion.controller.settings.system.deductionType.TaxSelect'
        ],

        controller : {
            type : 'criterion_payroll_settings_system_deduction_type_tax_select'
        },

        tbar : {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },

            defaults : {
                margin : 10,
                bodyPadding : 10
            },

            bind : {
                hidden : '{!showFilters}'
            },
            hidden : true,

            items : [
                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            xtype : 'criterion_currencyfield',
                            fieldLabel : i18n.gettext('Maximum Amount'),
                            bind : {
                                value : '{maxAmount}'
                            },
                            name : 'maxAmount',
                            labelWidth : 213,
                            allowBlank : false
                        }
                    ]
                },

                {
                    xtype : 'container',
                    style : {
                        'border-top' : '1px solid #e8e8e8 !important'
                    },
                    padding : '20 0 0 0',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            xtype : 'combobox',
                            reference : 'searchCombo',
                            flex : 1,
                            queryMode : 'local',
                            listeners : {
                                change : 'handleSearchTypeComboChange'
                            },
                            editable : false,
                            sortByDisplayField : false
                        },
                        {
                            xtype : 'textfield',
                            padding : '0 10',
                            flex : 2,
                            reference : 'searchText',
                            bind : {
                                hidden : '{!isTextFilter}'
                            },
                            listeners : [
                                {
                                    change : 'searchTextHandler'
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            reference : 'filterContainer',
                            bind : {
                                hidden : '{isTextFilter}'
                            },
                            flex : 2,
                            padding : '0 10',
                            layout : {
                                type : 'hbox',
                                align : 'stretch'
                            },
                            items : []
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-feature',
                            text : i18n.gettext('Clear'),
                            handler : 'clearFilters',
                            bind : {
                                hidden : '{!showClearButton}'
                            }
                        }
                    ]
                },
                // additional filters
                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    bind : {
                        hidden : '{!additionalFilters}'
                    },
                    hidden : true,
                    reference : 'additionalFiltersBlock',
                    items : []
                }
            ]
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelButton',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'onCancelHandler'
            },
            {
                xtype : 'button',
                reference : 'selectButton',
                bind : {
                    text : '{submitBtnText}',
                    disabled : '{!grid.selection}'
                },
                cls : 'criterion-btn-primary',
                scale : 'small',
                disabled : true,
                handler : 'onSelectButtonHandler'
            }
        ]

    }
});
