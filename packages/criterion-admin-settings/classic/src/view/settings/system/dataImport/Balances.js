Ext.define('criterion.view.settings.system.dataImport.Balances', function() {

    return {

        alias : 'widget.criterion_settings_data_import_balances',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.Balances'
        ],

        controller : 'criterion_settings_data_import_balances',

        items : [
            {
                xtype : 'panel',
                layout : 'card',
                itemId : 'actionsCardPanel',
                items : [
                    {
                        xtype : 'criterion_form',
                        bodyPadding : 0,
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                            minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                        },
                        isImport : true,
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Validate Accruals'),
                                reference : 'validateAccruals',
                                name : 'validateAccruals',
                                value : false,
                                inputValue : true
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Tolerance'),
                                name : 'tolerance',
                                reference : 'tolerance'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
