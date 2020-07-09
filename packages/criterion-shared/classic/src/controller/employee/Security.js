Ext.define('criterion.controller.employee.Security', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_employee_security',

        requires : [
            'criterion.model.person.LoginEnable',
            'criterion.view.person.LoginConfirm',
            'criterion.view.employee.ResetPassword'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        onEmployeeChange : function() {
            this.load();
        },

        onActivate : function() {
            this.load();
        },

        load : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                person = vm.get('person'),
                securityUsers = vm.getStore('securityUsers'),
                promises;

            if (!person) {
                return;
            }

            var personId = person.getId();

            view.setLoading(true);

            securityUsers.getProxy().setExtraParam('personId', personId);

            promises = [
                securityUsers.loadWithPromise(),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PERSON_IS_LOGIN_ENABLE,
                    method : 'GET',
                    params : {
                        personId : personId
                    }
                }).then(function(loginEnable) {
                    var loginData = Ext.create('criterion.model.person.LoginEnable', loginEnable);

                    vm.set('loginData', loginData);
                })
            ];

            Ext.Deferred
                .all(promises)
                .always(function() {
                    view.setLoading(false);
                });
        },

        _showLoginConfirm : function(record, callback, resetData) {
            Ext.create('criterion.view.person.LoginConfirm', {
                person : record,
                resetData : resetData,
                isReset : true,
                listeners : {
                    destroy : callback
                }
            }).show();
        },

        handleResetPassword : function() {
            var me = this,
                vm = this.getViewModel(),
                person = vm.get('person'),
                resetWnd,
                email = person.get('email'),
                vmData = {
                    email : email
                };

            if (email) {
                vmData.typeEmail = true;
                vmData.typePassword = false;
            } else {
                vmData.typeEmail = false;
                vmData.typePassword = true;
            }

            resetWnd = Ext.create('criterion.view.employee.ResetPassword', {
                viewModel : {
                    data : vmData
                }
            });
            resetWnd.on('reset', function(data) {
                criterion.Msg.confirm(
                    i18n.gettext('Reset Password'),
                    i18n.gettext('Do you want to reset password?'),
                    function(btn) {
                        if (btn === 'yes') {
                            resetWnd.destroy();

                            criterion.Api.resetPassword(
                                Ext.apply({
                                    personId : person.getId()
                                }, data),
                                function() {
                                    me._showLoginConfirm(
                                        person,
                                        Ext.emptyFn,
                                        data
                                    );
                                }
                            );
                        }
                    }
                );
            });
            resetWnd.show();
        },

        handleUnlock : function() {
            var view = this.getView(),
                url = Ext.String.format(
                    criterion.consts.Api.API.PERSON_UNLOCK_LOGIN,
                    this.getViewModel().get('person').getId()
                );

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : url,
                method : 'GET'
            }).then({
                success : function() {
                    criterion.Utils.toast(i18n.gettext('Successfully.'));
                    view.setLoading(false);
                },
                failure : function() {
                    criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                    view.setLoading(false);
                }
            })
        },

        onLoginClear : function(field) {
            field.setValue();
        },

        handleAddProfileClick : function() {
            var selectProfilesWindow,
                vm = this.getViewModel(),
                securityUsers = vm.getStore('securityUsers'),
                securityProfiles = vm.getStore('securityProfiles');

            selectProfilesWindow = Ext.create('criterion.view.MultiRecordPicker', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Profiles'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Role'),
                                dataIndex : 'role',
                                flex : 1,
                                excludeFromFilters : true,
                                renderer : function(value) {
                                    return criterion.Utils.getSecurityBinaryNamesFromInt(criterion.Consts.SECURITY_RESTRICTIONS_ROLES, value).join(', ').replace(/, \s*$/, '');
                                }
                            }
                        ],
                        excludedIds : Ext.Array.map(securityUsers.getRange(), function(item) {
                            return item.get('securityProfileId');
                        })
                    },
                    stores : {
                        inputStore : securityProfiles
                    }
                }
            });

            selectProfilesWindow.show();
            selectProfilesWindow.on('selectRecords', this.selectProfiles, this);
        },

        handleRefreshClick : function(cmp) {
            var store = cmp.up('criterion_gridview').getStore();

            store.load();
        },

        selectProfiles : function(records) {
            var vm = this.getViewModel(),
                person = vm.get('person'),
                securityUsers = vm.getStore('securityUsers');

            securityUsers.loadData(records.map(function(record) {
                return {
                    securityProfileId : record.getId(),
                    personId : person.getId(),
                    securityProfileName : record.get('name'),
                    securityProfileRole : (record.get('role') >>> 0).toString(2)
                }
            }), true);
        },

        onSave : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                securityUsers = vm.getStore('securityUsers'),
                settings = me.lookupReference('settings'),
                loginData = vm.get('loginData');

            if (!settings.isValid()) {
                return;
            }

            if (vm.get('loginData.enable') && !securityUsers.count()) {
                criterion.Msg.warning({
                    title : i18n.gettext('Add Security Profile'),
                    message : i18n.gettext('Please select at least one Security Profile for user if login is enabled.')
                });
            } else if (!loginData.dirty) {
                view.setLoading(true);

                me.syncStores().then({
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Settings saved.'));
                        view.setLoading(false);
                    }
                });
            } else if (vm.get('loginData.enable') && loginData.dirty && loginData.modified.is2faEnabled !== undefined) {
                if (loginData.get('is2faEnabled')) {
                    // TODO : add logic for 2fa enabling case (See https://perfecthr.atlassian.net/browse/CR-9186)
                    me.saveLoginData().then({
                        success : function() {
                            loginData.commit();
                            me.syncStores().then({
                                success : function() {
                                    criterion.Utils.toast(i18n.gettext('Settings saved.'));
                                    view.setLoading(false);
                                }
                            });
                        }
                    });
                } else {
                    view.setLoading(true);

                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.PERSON_SET_2FA_DISABLED,
                        params : {
                            personId : vm.get('person').getId()
                        },
                        method : 'GET'
                    }).then({
                        success : function() {
                            loginData.commit();
                            me.syncStores().then({
                                success : function() {
                                    criterion.Utils.toast(i18n.gettext('Settings saved.'));
                                    view.setLoading(false);
                                }
                            });
                        }
                    });
                }
            } else if (vm.get('loginData.enable')) {
                view.setLoading(true);

                me.syncStores().then({
                    success : function() {
                        me.saveLoginData().then({
                            success : function() {
                                loginData.commit();
                                criterion.Utils.toast(i18n.gettext('Settings saved.'));
                                view.setLoading(false);
                            }
                        });
                    }
                });
            } else {
                view.setLoading(true);

                me.saveLoginData().then({
                    success : function() {
                        loginData.commit();
                        me.syncStores().then({
                            success : function() {
                                criterion.Utils.toast(i18n.gettext('Settings saved.'));
                                view.setLoading(false);
                            }
                        });
                    }
                });
            }
        },

        onCancel : function() {
            var vm = this.getViewModel(),
                loginData = vm.get('loginData'),
                securityUsers = vm.getStore('securityUsers');

            loginData.reject();
            securityUsers.rejectChanges();
        },

        saveLoginData : function() {
            var vm = this.getViewModel(),
                loginData = vm.get('loginData');

            var url = Ext.String.format(
                criterion.consts.Api.API.PERSON_SET_LOGIN_ENABLE,
                vm.get('employee.id'),
                loginData.get('enable'),
                loginData.get('authenticationTypeCd'),
                loginData.get('login'),
                loginData.get('is2faEnabled'),
                loginData.get('isExternal')
            );

            return criterion.Api.requestWithPromise({
                url : url,
                method : 'PUT'
            }).then(function() {
                if (!vm.get('loginData.enable')) {
                    var securityUsers = vm.getStore('securityUsers');
                    securityUsers.removeAll();
                }
            });
        },

        syncStores : function() {
            var vm = this.getViewModel(),
                securityUsers = vm.getStore('securityUsers');

            return Ext.Deferred.all([
                securityUsers.syncWithPromise()
            ]);
        },

        handleLoginEnableChange : function(cmp, value) {
            var vm = this.getViewModel(),
                loginData;

            if (value) {
                loginData = vm.get('loginData');
                if (!loginData.get('login')) {
                    loginData.set('login', vm.get('person.email'));
                }
            }
        },

        handleEditAction : Ext.emptyFn
    };
});
