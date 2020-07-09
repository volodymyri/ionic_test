Ext.define('criterion.view.settings.system.dataImport.EmployeeTimeOffAccruals', function() {

    return {

        alias : 'widget.criterion_settings_data_import_employee_timeoff_accruals',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.EmployeeTimeOffAccruals'
        ],

        controller : 'criterion_settings_data_import_employee_timeoff_accruals',

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
                                xtype : 'datefield',
                                reference : 'accrualDate',
                                name : 'accrualDate',
                                submitFormat : criterion.consts.Api.DATE_FORMAT,
                                format : criterion.consts.Api.SHOW_DATE_FORMAT,
                                allowBlank : false,
                                fieldLabel : i18n.gettext('Accrual Date')
                            }
                        ]
                    }
                ]
            }
        ]
    }
});