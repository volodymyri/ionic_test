Ext.define('criterion.view.settings.system.TaxEngine', function() {

    const DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_settings_system_tax_engine',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.system.TaxEngine',
            'criterion.view.settings.system.TaxEngineForm',
            'criterion.store.TeTaxes'
        ],

        title : i18n.gettext('Tax Engine'),

        viewModel : {
            data : {
                employerId : null,
                countryCd : null
            },
            stores : {
                taxes : {
                    type : 'criterion_te_taxes'
                }
            }
        },

        controller : {
            type : 'criterion_settings_system_tax_engine',
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_system_tax_engine_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        bind : {
            store : '{taxes}'
        },

        tbar : [
            {
                xtype : 'criterion_code_detail_field',
                codeDataId : DICT.COUNTRY,
                fieldLabel : i18n.gettext('Country'),
                bind : {
                    value : '{countryCd}'
                },
                listeners : {
                    change : 'handleChangeFilter'
                }
            },
            '->',
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Show Inactive'),
                labelWidth : 100,
                reference : 'showInactive',
                margin : '0 40 0 0',
                listeners : {
                    change : 'handleChangeFilter'
                }
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
                    disabled : '{!countryCd}'
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
                dataIndex : 'taxName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Filing Status'),
                flex : 1,
                dataIndex : 'filingStatusDescription'
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                flex : 1,
                dataIndex : 'effectiveDate'
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                flex : 1,
                dataIndex : 'expirationDate'
            }
        ]
    };

});
