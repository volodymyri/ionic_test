Ext.define('criterion.view.settings.system.CustomFieldFormat', {

    extend : 'criterion.view.FormView',

    alias : 'widget.criterion_settings_system_custom_field_format',

    controller : {
        type : 'criterion_formview',
        externalUpdate : false
    },

    plugins : [
        'criterion_responsive_column'
    ],

    allowDelete : true,

    layout : {
        type : 'vbox',
        align : 'stretch'
    },

    bodyPadding : 0,

    title : i18n.gettext('Custom Field Format Details'),

    items : [
        {
            xtype : 'criterion_panel',

            bodyPadding : 25,

            plugins : [
                'criterion_responsive_column'
            ],

            items : [
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Name'),
                    bind : {
                        value : '{record.name}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Mask'),
                    bind : {
                        value : '{record.mask}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Validation'),
                    bind : {
                        value : '{record.validityTest}'
                    }
                }
            ]
        }
    ]
});
