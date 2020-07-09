Ext.define('criterion.view.settings.system.dataImport.PayRateRevisions', function() {

    return {

        alias : 'widget.criterion_settings_data_import_pay_rate_revisions',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.PayRateRevisions'
        ],

        controller : 'criterion_settings_data_import_pay_rate_revisions',

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
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                reference : 'assignmentAction',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.ASSIGNMENT_ACTION,
                                fieldLabel : i18n.gettext('Action Code')
                            },
                            {
                                xtype : 'datefield',
                                reference : 'effectiveDate',
                                allowBlank : false,
                                fieldLabel : i18n.gettext('Effective Date')
                            }
                        ]
                    }
                ]
            }
        ]
    }
});