Ext.define('criterion.view.settings.system.SelfServiceHelpFrom', {

    extend : 'criterion.view.FormView',

    alias : 'widget.criterion_settings_system_ess_help_form',

    controller : {
        type : 'criterion_formview',
        externalUpdate : false
    },

    bodyPadding : 0,

    title : i18n.gettext('Self Service Help Details'),

    defaults : {
        bodyPadding : 0
    },

    items : [
        {
            xtype : 'criterion_panel',

            plugins : [
                'criterion_responsive_column'
            ],

            defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,

            items : [
                {
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    items : [
                        {
                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Page'),
                                    name : 'securityEssFunctionCd',
                                    codeDataId : criterion.consts.Dict.SECURITY_ESS_FUNCTION,
                                    readOnly : true
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Title'),
                                    name : 'title',
                                    allowBlank : false
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Active'),
                                    name : 'isActive'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            flex : 1,
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            plugins : [
                'criterion_responsive_column'
            ],
            items : [
                {
                    xtype : 'container',
                    flex : 4,
                    layout : 'fit',
                    items : [
                        {
                            xtype : 'criterion_htmleditor',
                            // enableAlignments : false,
                            fieldLabel : i18n.gettext('Content'),
                            padding : '20 50 25 25',
                            name : 'content',
                            flex : 1,
                            maxWidth : null,
                            allowBlank : false
                        }
                    ]
                }
            ]
        }
    ]
});
