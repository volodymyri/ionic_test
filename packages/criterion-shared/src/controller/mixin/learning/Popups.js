Ext.define('criterion.controller.mixin.learning.Popups', function() {

    let MIXIN_ID = 'learningPopups';

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : MIXIN_ID
        },


        _createPopUp : function(record, actionName, cancelName, title) {
            var popup = Ext.create('criterion.ux.Panel', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],

                closable : false,
                scrollable : true,
                title : title || actionName,

                bodyPadding : 20,

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        text : cancelName || i18n.gettext('Cancel'),
                        ui : 'light',
                        handler : function() {
                            popup.destroy();
                        }
                    },
                    ' ',
                    {
                        xtype : 'button',
                        text : actionName,
                        hidden : !actionName,
                        handler : function() {
                            this.up('criterion_panel').fireEvent('actAction');
                            popup.destroy();
                        }
                    }
                ],

                items : [
                    {
                        xtype : 'component',
                        html : record.get('name') + ' [' + record.get('code') + ']'
                    },
                    {
                        xtype : 'component',
                        margin : '20 0 0 0',
                        html : record.get('description')
                    }
                ]
            });

            return popup;
        },

        _createPopUpAttend : function(record) {
            var popup = Ext.create('criterion.ux.Panel', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],

                viewModel : {
                    data : {
                        pin : ''
                    }
                },

                closable : false,
                scrollable : false,
                title : i18n.gettext('Attend'),

                bodyPadding : 20,

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        ui : 'light',
                        handler : function() {
                            popup.destroy();
                        }
                    },
                    ' ',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Attend'),
                        handler : function() {
                            var panel = this.up('criterion_panel'),
                                vm = panel.getViewModel();

                            panel.fireEvent('actAction', vm.get('pin'));
                            popup.destroy();
                        },
                        bind : {
                            disabled : '{!pin}'
                        }
                    }
                ],

                items : [
                    {
                        xtype : 'component',
                        html : record.get('name') + ' [' + record.get('code') + ']'
                    },
                    {
                        xtype : 'textfield',
                        margin : '30 0 40 0',
                        fieldLabel : i18n.gettext('PIN'),
                        labelWidth : 50,
                        bind : {
                            value : '{pin}'
                        },
                        allowBlank : false
                    }
                ],

                focusPin : function() {
                    var me = this;

                    Ext.defer(function() {
                        me.down('textfield').focus();
                    }, 100)
                }
            });

            return popup;
        },

        iFramePopUp : function(record, url, options = {}) {
            var me = this,
                popup = Ext.create('criterion.ux.Panel', {
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : true,
                            height : '100%',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
                        }
                    ],

                    closable : false,
                    scrollable : false,
                    title : record.get('name'),

                    bodyPadding : 20,

                    layout : 'fit',

                    buttons : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Close'),
                            ui : 'light',
                            handler : function() {
                                popup.fireEvent('close');
                            }
                        }
                    ],

                    items : [
                        {
                            xtype : 'uxiframe',
                            reference : 'iframe',
                            src : url
                        }
                    ]
                });

            popup.on('close', () => {
                let iframe = popup.down('[reference=iframe]'),
                    iframeDoc = iframe && iframe.getDoc();

                popup.setLoading(true);

                if (iframeDoc) {
                    iframeDoc.body.innerHTML = '';
                }

                Ext.defer(() => {
                    popup.destroy();

                    if (!options.preventLoadAfterClose) {
                        me.load();
                    }
                }, 500);
            });

            return popup;
        },

        showDownloadConfirm : function(record) {
            let me = this;

            criterion.Msg.confirm(
                Ext.util.Format.format('The course "{0}" is available for download only', record.get('name')),
                i18n.gettext('Do you want to download the course?'),
                function(btn) {
                    if (btn === 'yes') {
                        window.open(criterion.Api.getSecureResourceUrl(
                            Ext.String.format(
                                criterion.consts.Api.API.LEARNING_COURSE_DOWNLOAD,
                                record.getId()
                            )
                        ));
                    }

                    me.load();
                }
            );
        }

    }

});
