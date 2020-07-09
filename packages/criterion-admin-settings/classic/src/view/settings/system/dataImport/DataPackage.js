Ext.define('criterion.view.settings.system.dataImport.DataPackage', function() {

    var DATA_PACKAGE_PAYROLL_IMPORT = criterion.Consts.DATA_PACKAGE_PAYROLL_IMPORT;

    return {

        alias : 'widget.criterion_settings_data_import_data_package',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.DataPackage'
        ],

        controller : 'criterion_settings_data_import_data_package',

        viewModel : {
            data : {
                importPayroll : [],
                importIcons : false,
                importBadges : false
            }
        },

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
                            minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH,
                            width : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                        },
                        items : [
                            {
                                xtype : 'tagfield',
                                fieldLabel : i18n.gettext('Payroll'),
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['text', 'value'],
                                    data : [
                                        {
                                            text : DATA_PACKAGE_PAYROLL_IMPORT.US.text,
                                            value : DATA_PACKAGE_PAYROLL_IMPORT.US.value
                                        },
                                        {
                                            text : DATA_PACKAGE_PAYROLL_IMPORT.CANADA.text,
                                            value : DATA_PACKAGE_PAYROLL_IMPORT.CANADA.value
                                        }
                                    ]
                                }),
                                displayField : 'text',
                                valueField : 'value',
                                queryMode : 'local',
                                bind : {
                                    value : '{importPayroll}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Community Icons'),
                                bind : {
                                    value : '{importIcons}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Community Badges'),
                                bind : {
                                    value : '{importBadges}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
});