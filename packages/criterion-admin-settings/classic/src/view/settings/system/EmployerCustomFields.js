Ext.define('criterion.view.settings.system.EmployerCustomFields', function() {

    return {

        alias : 'widget.criterion_employer_custom_fields',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.payroll.EmployerCustomFields'
        ],

        controller : {
            type : 'criterion_employer_custom_fields'
        },

        config : {
            entityType : null
        },

        listeners : {
           activate : 'handleActivate'
        },

        initComponent : function() {
            var me = this;

            Ext.apply(me, {

                bodyPadding : 0,

                tbar : {
                    padding : 0,
                    items : [
                        {
                            xtype : 'criterion_settings_employer_bar',
                            context : 'criterion_settings',
                            padding : '35 25 10 35',
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        }
                    ]
                },

                items : [
                    {
                        xtype : 'criterion_customfields_container',

                        padding : '0 20',

                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                        suppressCaption : true,
                        topBorder : true,
                        reference : 'customfields',
                        entityType : me.getEntityType()
                    }
                ],

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Update'),
                        cls : 'criterion-btn-primary',
                        listeners : {
                            click : 'handleUpdate'
                        }
                    }
                ]
            });

            me.callParent(arguments);
        }
    };

});
