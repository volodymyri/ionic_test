Ext.define('criterion.view.ess.preferences.TwoFA', function() {

    return {
        alias : 'widget.criterion_ess_preferences_2_fa',

        extend : 'criterion.ux.window.Window',

        padding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        layout : 'hbox',

        requires : [
            'criterion.controller.ess.preferences.TwoFA'
        ],

        cls : 'criterion-modal',

        title : i18n.gettext('Add Criterion to your Two-Factor Authentication App'),

        draggable : false,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : 835,
                height : 370,
                modal : true
            }
        ],

        viewModel : {
            data : {
                totp : '',
                seed : ''
            },
            formulas : {
                buttonEnabled : function(get) {
                    let totp = get('totp');

                    return totp && totp.length === 6;
                },
                seedFormatted : function(get) {
                    let seed = get('seed');

                    return seed && seed.replace(/\B(?=(\w{4})+(?!\w))/g, ' ');
                }
            }
        },

        controller : {
            type : 'criterion_ess_preferences_2_fa'
        },

        listeners : {
            show : 'onShow'
        },

        items : [
            {
                xtype : 'container',
                layout : 'vbox',
                flex : 3,
                items : [
                    {
                        layout : 'vbox',
                        defaultType : 'container',
                        items : [
                            {
                                html : i18n.gettext('You’ll need to install a two factor authentication application on your smartphone or tablet. For more information, visit our two-factor authentication help article.'),
                                width : 550,
                                height : 50
                            },
                            {
                                html : Ext.util.Format.format('<strong>{0}</strong>', i18n.gettext('Configure the app')),
                                height : 30
                            },
                            {
                                html : Ext.util.Format.format('<span class="criterion-number-1">{0}</span>', i18n.gettext('Open your two-factor authentication app and add your criterion account by scanning the qr code to the right. If you can’t use a QR code, enter this text code:')),
                                height : 50,
                                width : 550
                            },
                            {
                                bind : {
                                    html : '<strong>{seedFormatted}</strong>'
                                },
                                height : 30
                            },
                            {
                                html : Ext.util.Format.format('<span class="criterion-number-2">{0}</span>', i18n.gettext('Enter the 6-digit code that the application generates.')),
                                height : 30
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'textfield',
                                bind : {
                                    value : '{totp}'
                                }
                            },
                            {
                                xtype : 'button',
                                margin : '0 0 0 5',
                                bind : {
                                    text : i18n.gettext('Enable'),
                                    hidden : '{!buttonEnabled}'
                                },
                                handler : 'handleEnable'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'image',
                reference : 'qrCode',
                alt : 'QR Code',
                width : 250,
                height : 250,
                src : criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.PERSON_GET_QR_CODE + '?_dc=' + (+Date.now())),
                listeners : {
                    afterrender : 'handle2FAImageRendered'
                }
            }
        ]
    };
});
