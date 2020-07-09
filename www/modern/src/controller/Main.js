Ext.define('ess.controller.Main', function() {

    return {

        extend : 'criterion.controller.ess.Main',

        alias : 'controller.ess_modern_main',

        requires : [
            'ess.view.communities.Profile'
        ],

        listen : {
            global : {
                toggleMainMenu : 'toggleMainMenu',
                switchPage : 'handleSwitchPage',
                showMyProfile : 'handleShowMyProfile',
                modern_employeeChanged : 'onEmployeeChange',
                changeCheckInPlace : 'onChangeCheckInPlace',
                showAdditionalMenu : 'onShowAdditionalMenu'
            }
        },

        _prevPage : null,

        init : function() {
            criterion.CodeDataManager.load([criterion.consts.Dict.ENTITY_TYPE]);

            this.callParent(arguments);

            Ext.Viewport.on('orientationchange', function(viewPort, mode, y, x) {
                Ext.GlobalEvents.fireEvent('orientationChange', viewPort, mode, y, x);
            }, this);
        },

        onEmployeeChange : function() {
            this.getView().setLoading(false);

            var vm = this.getViewModel(),
                employee = criterion.Application.getEmployee(),
                employer = criterion.Application.getEmployer(),
                timeEntry = this.lookup('timeEntry'),
                timeEntryButton = this.lookup('timeEntryButton'),
                timeEntryAccess = criterion.SecurityManager.getESSAccess(criterion.SecurityManager.ESS_KEYS.TIME_ENTRY);

            vm.set('disableTimeEntry', true);

            timeEntryButton.setHidden(true);

            if (timeEntryAccess) {
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.HAS_TRACKABLE_INCOMES,
                    method : 'GET'
                }).then(function(hasTrackableIncomes) {
                    if (hasTrackableIncomes) {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.TIME_ENTRY_START_DATA,
                            method : 'GET'
                        }).then(function(startData) {
                            vm.set('disableTimeEntry', false);

                            if (startData) {
                                timeEntryButton.setHidden(!startData.assignments || !startData.assignments.length);
                                timeEntry.getViewModel().set('startData', startData);
                            }
                        })
                    }
                });
            }

            vm.set({
                employee : employee,
                employer : employer,
                employeeId : employee.getId(),
                employerId : employer.getId()
            });
        },

        handleShowMyProfile : function() {
            var view = this.getView(),
                employeeId = this.getViewModel().get('employeeId'),
                profileView = this.lookupReference('myProfileView');

            if (!profileView) {
                profileView = Ext.create(
                    {
                        xtype : 'ess_communities_profile',
                        reference : 'myProfileView',
                        listeners : {
                            cancelViewProfile : 'cancelViewProfile'
                        }
                    }
                );
                view.add(profileView);
            }

            profileView.getViewModel().set({
                title : i18n.gettext('Loading...'),
                employeeId : employeeId,
                ownProfile : true
            });
            view.getLayout().setAnimation(
                {
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(profileView);
        },

        cancelViewProfile : function() {
            this.toggleMainMenu();
        },

        toggleMainMenu : function() {
            var view = this.getView(),
                mainMenu = this.lookupReference('mainMenu'),
                activeItem = view.getActiveItem();

            if (activeItem !== mainMenu) {
                this._prevPage = activeItem;
                view.getLayout().setAnimation(
                    {
                        type : 'slide',
                        direction : 'right'
                    }
                );
                view.setActiveItem(mainMenu);
                this.getViewModel().set('pageIdent', view.PAGE_IDENTS.SELF_SERVICE);
            } else {
                view.getLayout().setAnimation(
                    {
                        type : 'slide',
                        direction : 'left'
                    }
                );
                view.setActiveItem(this._prevPage);
            }
        },

        handleSwitchPage : function(cardReference) {
            this.getView().getLayout().setAnimation(
                {
                    type : 'slide',
                    direction : 'left'
                }
            );
            this.getView().setActiveItem(this.lookup(cardReference));
        },

        onChangeCheckInPlace : function(placeName) {
            this.getViewModel().set('placeName', placeName);
        },

        goToSelfService : function() {
            this.getViewModel().set('pageIdent', this.getView().PAGE_IDENTS.SELF_SERVICE);
            this.toggleMainMenu();
        },

        goToTimeEntry : function() {
            this.getViewModel().set('pageIdent', this.getView().PAGE_IDENTS.TIME_ENTRY);
            Ext.GlobalEvents.fireEvent('switchPage', 'timeEntry');
        },

        goToExternalLinks : function() {
            this.getViewModel().set('pageIdent', this.getView().PAGE_IDENTS.EXTERNAL_LINKS);
            Ext.GlobalEvents.fireEvent('switchPage', 'externalLinks');
        },

        _setBiometricLoginState : function(state) {
            if (window['plugins'] && plugins.appPreferences) {
                var appPreferences = plugins.appPreferences;

                appPreferences.store(
                    _ => {
                    },
                    _ => {
                    },
                    'scanningEnabled',
                    state
                );
            }
        },

        onShowAdditionalMenu : function() {
            let me = this,
                login = '',
                showStandardMenu = function() {
                    Ext.Viewport.setMenu(
                        {
                            cls : 'ess-bottom-menu',
                            items : [
                                {
                                    text : i18n.gettext('Log Out'),
                                    iconCls : 'md-icon-exit-to-app',
                                    textAlign : 'left',
                                    cls : 'additional_menu_btn',
                                    handler : function() {
                                        Ext.Viewport.hideMenu('bottom');
                                        criterion.Api.logout();
                                    }
                                }
                            ]
                        },
                        {
                            side : 'bottom',
                            cover : true
                        }
                    );

                    Ext.Viewport.showMenu('bottom');
                },
                showMenuWithSecurity = function(showFingerprint) {
                    Ext.Viewport.setMenu(
                        {
                            cls : 'ess-bottom-menu',
                            items : [
                                {
                                    xtype : 'fieldcontainer',

                                    label : i18n.gettext('Security Settings'),

                                    hidden : !window['device'] || (!window['plugins'] || !plugins.appPreferences),

                                    layout : 'vbox',

                                    items : [
                                        {
                                            xtype : 'togglefield',

                                            label : i18n.gettext('Sign in with scanning'),

                                            labelAlign : 'left',

                                            labelWidth : 'auto',

                                            hidden : !showFingerprint,

                                            listeners : {
                                                painted : (cmp) => {
                                                    criterion.Api.requestWithPromise({
                                                        url : criterion.consts.Api.API.MOBILE_SECURITY_BIOMETRIC_IS_ENABLED,
                                                        params : {
                                                            deviceId : device.uuid
                                                        },
                                                        method : 'GET'
                                                    }).then(function(response) {
                                                        if (response) {
                                                            if (cmp.getValue() !== response.enabled) {
                                                                cmp._resetState = true;
                                                                cmp.setValue(response.enabled);
                                                            }

                                                            login = response.login;
                                                        }
                                                    });
                                                },
                                                change : (cmp, newValue, oldValue) => {
                                                    if (!!cmp._resetState) {
                                                        cmp._resetState = false;

                                                        return;
                                                    }

                                                    if (Ext.isDefined(oldValue)) {
                                                        if (newValue) {
                                                            Fingerprint.show({
                                                                clientId : login,
                                                                clientSecret : Ext.Number.randomInt(1000000, 9999999),
                                                                disableBackup : true,
                                                                localizedFallbackTitle : i18n.gettext('Cancel')
                                                            }, () => {
                                                                criterion.Api.requestWithPromise({
                                                                    url : criterion.consts.Api.API.MOBILE_SECURITY_ENABLE_BIOMETRIC,
                                                                    jsonData : {
                                                                        isEnabled : newValue,
                                                                        deviceId : device.uuid
                                                                    },
                                                                    method : 'POST'
                                                                }).then(function(response) {
                                                                    criterion.Utils.toast(i18n.gettext('Successfully enabled'));
                                                                    me._setBiometricLoginState(true);
                                                                });
                                                            }, () => {
                                                                cmp._resetState = true;
                                                                cmp.setValue(oldValue || false);
                                                            });
                                                        } else {
                                                            criterion.Api.requestWithPromise({
                                                                url : criterion.consts.Api.API.MOBILE_SECURITY_ENABLE_BIOMETRIC,
                                                                jsonData : {
                                                                    isEnabled : newValue,
                                                                    deviceId : device.uuid
                                                                },
                                                                method : 'POST'
                                                            }).then(function(response) {
                                                                criterion.Utils.toast(i18n.gettext('Successfully disabled'));
                                                                me._setBiometricLoginState(false);
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype : 'fieldcontainer',

                                            label : i18n.gettext('ClientID'),

                                            labelAlign : 'left',

                                            labelWidth : 'auto',

                                            layout : 'hbox',

                                            items : [
                                                {
                                                    xtype : 'textfield',

                                                    listeners : {
                                                        painted : cmp => {
                                                            if (window['plugins'] && plugins.appPreferences) {
                                                                let appPreferences = plugins.appPreferences;

                                                                appPreferences.fetch(
                                                                    value => {
                                                                        if (value) {
                                                                            cmp.setValue(value);
                                                                        }
                                                                    },
                                                                    _ => {
                                                                    }, 'companyId');
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype : 'button',

                                                    text : i18n.gettext('Ok'),

                                                    handler : function(cmp) {
                                                        if (window['plugins'] && plugins.appPreferences) {
                                                            let appPreferences = plugins.appPreferences;

                                                            appPreferences.store(
                                                                _ => {
                                                                    criterion.Utils.toast(i18n.gettext('Successfully'));
                                                                },
                                                                _ => {
                                                                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                                                                },
                                                                'companyId',
                                                                cmp.up().down('textfield').getValue() || null
                                                            );
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    text : i18n.gettext('Log Out'),
                                    iconCls : 'md-icon-exit-to-app',
                                    textAlign : 'left',
                                    cls : 'additional_menu_btn',
                                    handler : function() {
                                        Ext.Viewport.hideMenu('bottom');
                                        criterion.Api.logout();
                                    }
                                }
                            ]
                        },
                        {
                            side : 'bottom',
                            cover : true
                        }
                    );

                    Ext.Viewport.showMenu('bottom');
                };

            if (window['device'] && (window['Fingerprint'] || (window['plugins'] && plugins.appPreferences))) {
                Fingerprint.isAvailable(() => {
                    showMenuWithSecurity(true);
                }, () => {
                    showMenuWithSecurity();
                });
            } else {
                showStandardMenu();
            }
        }
    };
});
