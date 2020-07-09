Ext.define('criterion.view.settings.system.dataImport.Employment', function() {

    return {

        alias : 'widget.criterion_settings_data_import_employment',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.Employment'
        ],

        controller : 'criterion_settings_data_import_employment',

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
                                fieldLabel : i18n.gettext('Use Positions'),
                                name : 'usePositions',
                                value : false,
                                inputValue : true
                            }
                        ]

                    }
                ]
            }
        ]
    }
});