Ext.define('criterion.view.settings.system.ClassificationCode', function() {

    return {

        alias : 'widget.criterion_settings_classification_code',

        extend : 'criterion.view.FormView',

        bodyPadding : 0,

        title : i18n.gettext('Classification Code'),

        controller : {
            externalUpdate : false
        },

        items : [
            {
                xtype : 'criterion_panel',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

                bodyPadding : '25 10',

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        name : 'caption',
                        allowBlank : false
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Type'),
                        bind : {
                            store : '{codeDataTypes}'
                        },
                        valueField : 'id',
                        displayField : 'description',
                        allowBlank : false,
                        queryMode : 'local',
                        name : 'codeDataTypeId'
                    }
                ]
            }
        ]
    };

});
