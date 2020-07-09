Ext.define('criterion.view.settings.system.StaticToken', function() {

    return {

        alias : 'widget.criterion_settings_system_static_token',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.StaticToken'
        ],

        controller : {
            type : 'criterion_settings_system_static_token',
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                disableSave : function(get) {
                    return !get('record.securityProfileType') && !(get('record.securityProfileId') || get('record.personId'));
                }
            }
        },

        bodyPadding : 0,

        items : [
            {
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                plugins : [
                    'criterion_responsive_column'
                ],

                bodyPadding : '25 10',

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Type'),
                        allowBlank : false,
                        displayField : 'text',
                        valueField : 'id',
                        bind : {
                            store : '{tokenTypes}',
                            value : '{record.tokenType}'
                        },
                        listeners : {
                            change : 'onTokenTypeChange'
                        }
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel : i18n.gettext('Security Profile'),
                        bind : {
                            disabled : '{record.tokenType !== ' + criterion.Consts.STATIC_TOKEN_TYPES.SYSTEM + '}'
                        },
                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                readOnly : true,
                                readOnlyCls : '',
                                bind : {
                                    value : '{record.securityProfileName}'
                                },
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        handler : 'onSecurityProfileClear',
                                        hideOnReadOnly : false,
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-light',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                listeners : {
                                    click : 'onSecurityProfileSearch'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        fieldLabel : i18n.gettext('User Name'),
                        layout : 'hbox',
                        bind : {
                            disabled : '{record.tokenType !== ' + criterion.Consts.STATIC_TOKEN_TYPES.USER + '}'
                        },
                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                readOnlyCls : '',
                                readOnly : true,
                                reference : 'personName',
                                bind : {
                                    value : '{record.personName}'
                                },
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        handler : 'onPersonClear',
                                        hideOnReadOnly : false,
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                cls : 'criterion-btn-light',
                                margin : '0 0 0 5',
                                listeners : {
                                    click : 'onPersonSearch'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
});