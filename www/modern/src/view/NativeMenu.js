Ext.define('ess.view.NativeMenu', function() {

    return {
        alias : 'widget.ess_modern_native_menu',

        extend : 'Ext.form.Panel',

        title : 'Settings',

        viewModel : {
            data : {
                loginServer : ''
            }
        },

        defaults : {
            labelWidth : 150
        },

        currentActiveItem : null,

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked: 'top',
                title : 'Settings',

                buttons : [
                    {
                        type : 'back',
                        handler : function() {
                            var view = this.up('panel');
                            view.up().setActiveItem(view.currentActiveItem);
                        }
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-done',
                        handler : function() {
                            var loginServer = this.up('panel').getViewModel().get('loginServer');
                            if (window['plugins'] && plugins.appPreferences) {
                                var appPreferences = plugins.appPreferences;

                                appPreferences.store (
                                    function() {
                                        Ext.Msg.confirm(
                                            'Successfully',
                                            'Do you want to logout?',
                                            function(btn) {
                                                if (btn == 'yes') {
                                                    criterion.Api.logout();
                                                }
                                            }
                                        );
                                    }, 
                                    function() {
                                        criterion.Utils.toast(i18n.gettext('Something went wrong'));
                                    }, 'loginServer', loginServer);
                            }
                        }
                    }
                ]
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Login Server'),
                bind : {
                    value : '{loginServer}'
                },
                allowBlank : false
            }
        ]
    };

});
