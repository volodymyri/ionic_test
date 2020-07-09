Ext.define('criterion.view.employee.Security', function() {

    var UI_DEFAULTS = criterion.Consts.UI_DEFAULTS;

    return {

        alias : 'widget.criterion_employee_security',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.grid.PanelExtended',
            'criterion.controller.employee.Security',
            'criterion.store.security.Users',
            'criterion.store.security.Profiles'
        ],

        viewModel : {
            data : {
                loginData : null
            },
            formulas : {
                externalLabel : function(get) {
                    return i18n.gettext(Ext.String.format('Enable {0} authorization', criterion.Api.getAuthenticationType()));
                },
                externalAvailable : function(get) {
                    return get('loginData.enable') && criterion.Api.getIsExternalAuth();
                },
                loginDataChanged : {
                    bind : {
                        bindTo : '{loginData}',
                        deep : true
                    },
                    get : function(loginData) {
                        return loginData && loginData.dirty;
                    }
                }
            },
            stores : {
                securityUsers : {
                    type : 'criterion_security_users'
                },
                securityProfiles : {
                    type : 'criterion_security_profiles'
                }
            }
        },

        controller : {
            type : 'criterion_employee_security'
        },

        title : i18n.gettext('Security'),

        listeners : {
            activate : 'onActivate'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },
        height : 'auto',
        scrollable : true,

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                text : i18n.gettext('Cancel'),
                handler : 'onCancel'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                scale : 'small',
                text : i18n.gettext('Save'),
                handler : 'onSave',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SECURITY, criterion.SecurityManager.UPDATE, true)
                }
            }
        ],

        items : [
            {
                xtype : 'criterion_form',
                reference : 'settings',

                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER_NO_PADDING,

                items : [
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                layout : 'vbox',
                                flex : 4,
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        name : 'enable',
                                        fieldLabel : i18n.gettext('Enable Login'),
                                        reference : 'loginEnabled',
                                        bind : '{loginData.enable}',
                                        handler : 'handleLoginEnableChange'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        name : 'isExternal',
                                        hidden : true,
                                        bind : {
                                            fieldLabel : '{externalLabel}',
                                            value : '{loginData.isExternal}',
                                            hidden : '{!externalAvailable}'
                                        }
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        name : 'is2faEnabled',
                                        fieldLabel : i18n.gettext('Enable 2FA'),
                                        hidden : true,
                                        bind : {
                                            value : '{loginData.is2faEnabled}',
                                            hidden : '{!loginData.enable}',
                                            disabled : '{loginData.isExternal}'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        reference : 'login',
                                        fieldLabel : i18n.gettext('User Name'),
                                        bind : {
                                            value : '{loginData.login}',
                                            disabled : '{!loginData.enable}'
                                        },

                                        cls : 'criterion-hide-default-clear',
                                        triggers : {
                                            clear : {
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onLoginClear'
                                            }
                                        },
                                        allowBlank : false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                layout : {
                                    type : 'hbox',
                                    pack : 'end'
                                },
                                hidden : true,
                                bind : {
                                    hidden : '{!loginData.enable}'
                                },
                                items : [
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-feature',
                                        scale : 'small',
                                        hidden : true,
                                        text : i18n.gettext('Reset Password'),
                                        handler : 'handleResetPassword',
                                        bind : {
                                            hidden : '{!loginData.enable}',
                                            disabled : '{loginDataChanged || loginData.isExternalAuth || loginData.isExternal}'
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-feature',
                                        margin : '0 0 0 20',
                                        scale : 'small',
                                        text : i18n.gettext('Unlock'),
                                        handler : 'handleUnlock',
                                        hidden : true,
                                        bind : {
                                            hidden : '{!loginData.enable}',
                                            disabled : '{loginDataChanged || loginData.isExternalAuth}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',

                flex : 1,
                padding : '20 0 0 0',

                controller : {
                    type : 'criterion_employee_security'
                },
                bind : {
                    hidden : '{!loginData.enable}',
                    store : '{securityUsers}'
                },

                useDefaultTbar : false,

                tbar : [
                    {
                        xtype : 'component',
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add'),
                        margin : '0 10 5 0',
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddProfileClick'
                        }
                    }
                ],

                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Profile Name'),
                        dataIndex : 'securityProfileName'
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Role'),
                        dataIndex : 'securityProfileRole',
                        renderer : function(value) {
                            return criterion.Utils.getSecurityBinaryNamesFromInt(criterion.Consts.SECURITY_RESTRICTIONS_ROLES, value).join(', ').replace(/, \s*$/, '');
                        }
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
