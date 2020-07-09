Ext.define('criterion.controller.ess.preferences.Security', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_preferences_security',

        requires : [
            'criterion.model.person.Settings',
            'criterion.view.ess.preferences.TwoFA',
            'criterion.ux.Panel'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        onActivate : function() {
            this.get2FAEnabled();
        },

        get2FAEnabled : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                personId = criterion.Api.getCurrentPersonId();

            view.setLoading(true);
            criterion.Api.request({
                url : Ext.String.format(criterion.consts.Api.API.PERSON_IS_2FA_ENABLED, personId),
                method : 'GET',
                scope : this,
                callback : function(options, success, response) {
                    var value = Ext.decode(response.responseText);
                    vm.set('tFAEnabled', value.result);
                    view.setLoading(false);
                }
            });
        },

        onEdit2FA : function() {
            var me = this,
                view = this.getView(),
                tFAEnabled = this.getViewModel().get('tFAEnabled');

            if (tFAEnabled) {
                view.setLoading(true);
                criterion.Api.request({
                    url : criterion.consts.Api.API.PERSON_SET_2FA_DISABLED,
                    method : 'GET',
                    scope : this,
                    callback : function(options, success, response) {
                        var value = Ext.decode(response.responseText);

                        if (value.success) {
                            criterion.Utils.toast(i18n.gettext('Disabled Successfully'));
                        } else {
                            criterion.Utils.toast(i18n.gettext('Something went wrong'));
                        }
                        view.setLoading(false);
                        me.get2FAEnabled();
                    }
                });
            } else {
                var twoFAWindow = Ext.create({
                    xtype : 'criterion_ess_preferences_2_fa'
                });

                twoFAWindow.on('close', function() {
                    me.get2FAEnabled();
                    me.setCorrectMaskZIndex(false);
                });

                twoFAWindow.show();

                me.setCorrectMaskZIndex(true);
            }
        },

        onResetPassword : function() {
            var me = this,
                view = this.getView();

            Ext.create('criterion.ux.window.MessageBox', {
                buttonIds : [
                    'ok', 'no', 'yes', 'cancel'
                ]
            }).show({
                title : i18n.gettext('Reset Password'),
                icon : criterion.Msg.QUESTION,
                message : i18n.gettext('Do you want to reset password?'),
                buttons : criterion.Msg.YESNO,
                closable : false,
                callback : function(btn) {
                    if (btn == 'yes') {
                        view.setLoading(true);

                        criterion.Api.resetPassword(
                            {
                                personId : criterion.Api.getCurrentPersonId()
                            },
                            me.onSuccessResetPassword,
                            me.onFailureResetPassword,
                            me
                        );

                    }
                }
            });
        },

        onSuccessResetPassword : function() {
            var view = this.getView(),
                messagePopup;

            messagePopup = Ext.create({
                xtype : 'criterion_panel',

                cls : 'criterion-preferences-password-success',
                closable : true,
                header : false,

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 310,
                        width : 510
                    }
                ],
                layout : {
                    type : 'vbox',
                    align : 'center',
                    pack : 'center'
                },

                defaults : {
                    padding : '10 0'
                },

                items : [
                    {
                        html : '<span class="criterion-status-ok"/>'
                    },
                    {
                        html : '<strong class="criterion-preferences-password-success-text">Reset Password Email Sent!</strong>'
                    },
                    {
                        html : 'Please check your spam folder if you don’t receive the email.'
                    }
                ],
                bbar : {
                    padding : '12 2',
                    items : [
                        '->',
                        {
                            padding : '8 25',
                            text : i18n.gettext('Done'),
                            handler : function() {
                                messagePopup.close()
                            }
                        }
                    ]
                }
            });

            messagePopup.show();
            view.setLoading(false);
        },

        onFailureResetPassword : function() {
            var view = this.getView();

            view.setLoading(false);
        },

        onSave : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                me = this;

            view.setLoading(true);

            if (vm.get('password') && vm.get('newPassword') && (vm.get('rePassword') === vm.get('newPassword'))) {
                criterion.Api.request({
                    url : criterion.consts.Api.API.PERSON_CHANGE_PASSWORD,
                    method : 'POST',
                    jsonData : Ext.JSON.encode({
                        personId : criterion.Api.getCurrentPersonId(),
                        oldPassword : vm.get('password'),
                        newPassword : vm.get('newPassword')
                    }),
                    silent : true,
                    scope : me,
                    success : function() {
                        vm.set('passwordErrorText', '');
                        criterion.Utils.toast(i18n.gettext('Password successfully changed.'));
                    },
                    failure : function(response) {
                        var data = Ext.decode(response.responseText, true),
                            info = data && criterion.consts.Error.getErrorInfo(data);

                        info && vm.set('passwordErrorText', info.description);
                    },
                    callback : function() {
                        view.setLoading(false, null);
                    }
                });
            }
        }
    };
});
