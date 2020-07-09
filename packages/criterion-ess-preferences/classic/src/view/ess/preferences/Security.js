Ext.define('criterion.view.ess.preferences.Security', function() {

    return {
        alias : 'widget.criterion_ess_preferences_security',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.preferences.Security'
        ],

        viewModel : {
            data : {
                record : null,
                password : '',
                newPassword : '',
                rePassword : '',
                passwordErrorText : '',
                tFAEnabled : false
            },

            formulas : {
                checkNewPasswordText : function(data) {
                    var hasError = !!data('passwordErrorText') || data('newPassword') && data('rePassword') && (data('newPassword') !== data('rePassword')),
                        errorText;

                    if (!data('passwordErrorText')) {
                        errorText = hasError ? i18n.gettext('Passwords did not match') : i18n.gettext('Passwords match');
                    } else {
                        errorText = data('passwordErrorText');
                    }

                    return Ext.util.Format.format('<span class="{0}">{1}</span>', hasError ? 'notMatch' : 'match', errorText);
                },
                canSave : function(data) {
                    return data('password') && data('newPassword') && data('rePassword') && (data('newPassword') === data('rePassword'));
                },
                hasPassword : function(data) {
                    return data('newPassword') && data('rePassword');
                },
                tFAEnabledText : function(data) {
                    return data('tFAEnabled') ? i18n.gettext('On') : i18n.gettext('Off');
                },
                tFAEditText : function(data) {
                    return Ext.util.Format.format('<div class="{0}">{1}</div>',
                        data('tFAEnabled') ? 'criterion-red twoFA' : 'twoFA',
                        data('tFAEnabled') ? i18n.gettext('Disable two factor authentication') : i18n.gettext('Set up two factor authentication')
                    )
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'onActivate',
            edit2FA : 'onEdit2FA',
            resetPassword : 'onResetPassword'
        },

        controller : {
            type : 'criterion_ess_preferences_security'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        dockedItems : [
            {
                xtype : 'toolbar',
                dock : 'bottom',

                cls : 'criterion-ess-panel-toolbar',
                trackLastItems : true,

                items : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Change'),
                        bind : {
                            disabled : '{!canSave}'
                        },
                        listeners : {
                            click : 'onSave'
                        }
                    }
                ]
            }
        ],

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
            maxWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
        },

        title : i18n.gettext('Security'),

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        items : [
            {
                xtype : 'fieldcontainer',

                layout : 'hbox',

                fieldLabel : i18n.gettext('Two-Factor Authentication'),

                items : [
                    {
                        xtype : 'component',
                        padding : '10 10 0 0',
                        bind : {
                            html : '<span class="criterion-twofa-{tFAEnabled}"> {tFAEnabledText}</span>'
                        }
                    },
                    {
                        xtype : 'component',
                        padding : '10 0 0 0',
                        bind : {
                            html : '{tFAEditText}'
                        },
                        listeners : {
                            afterrender : function(comp) {
                                comp.el.on('click', function() {
                                    comp.up('criterion_ess_preferences_security').fireEvent('edit2FA')
                                })
                            }
                        }
                    }
                ]
            },

            {
                xtype : 'component',
                html : '<span class="bold">' + i18n.gettext('Change Password') + '</span>',
                margin : '20 0 20 0'
            },

            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Old Password'),
                name : 'password',
                bind : '{password}',
                emptyText : i18n.gettext('password'),
                inputType : 'password'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('New Password'),
                name : 'new-password',
                bind : '{newPassword}',
                emptyText : i18n.gettext('password'),
                inputType : 'password'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Confirm New Password'),
                name : 're-password',
                bind : '{rePassword}',
                emptyText : i18n.gettext('password'),
                inputType : 'password',
                width : '100%'
            },
            {
                xtype : 'component',
                margin : '0 0 20 0',
                bind : {
                    html : '{checkNewPasswordText}',
                    hidden : '{!hasPassword}'
                }
            },
            {
                xtype : 'component',
                html : Ext.String.format('<span>{0}</span>', i18n.gettext('Reset Password')),
                cls : 'resetLink',
                listeners : {
                    afterrender : function(comp) {
                        comp.el.on('click', function() {
                            comp.up('criterion_ess_preferences_security').fireEvent('resetPassword');
                        })
                    }
                }
            }
        ]
    };
});
