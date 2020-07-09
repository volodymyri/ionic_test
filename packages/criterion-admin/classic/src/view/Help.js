Ext.define('criterion.view.Help', function() {

    return {
        alias : 'widget.criterion_help',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.Help',
            'criterion.view.help.*'
        ],

        inAnimation : false,

        floating : true,

        alwaysOnTop : 2,

        shadow : 'sides',

        defaultAlign : 'br-br',

        responsiveConfig : criterion.Utils.createResponsiveConfig([
            {
                rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDER,
                config : {
                    width : 650
                }
            },
            {
                rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDE,
                config : {
                    width : 450
                }
            }
        ]),

        layout : 'card',

        controller : {
            type : 'criterion_help'
        },

        listeners : {
            afterrender : 'onAfterRender',
            show : 'onShow'
        },

        viewModel : {
            data : {
                helpCenterEmail : criterion.consts.Help.HELP_CENTER_EMAIL,
                helpCenterPhone : criterion.consts.Help.HELP_CENTER_PHONE,
                showCreateTicket : true
            },
            stores : {
                releaseNotes : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    sorters : [{
                        property : 'releaseDate',
                        direction : 'DESC'
                    }],
                    fields : [
                        {
                            name : 'version',
                            type : 'string'
                        },
                        {
                            name : 'releaseDate',
                            type : 'date'
                        },
                        {
                            name : 'heading',
                            type : 'string'
                        },
                        {
                            name : 'detail',
                            type : 'string'
                        },
                        {
                            name : 'blogUrl',
                            type : 'string'
                        }
                    ]
                }
            }
        },

        items : [
            {
                xtype : 'criterion_help_articles',
                scrollable : true,
                listeners : {
                    hideToolbar : 'onToolbarHide'
                }
            },
            {
                xtype : 'criterion_help_requests',
                scrollable : 'vertical'
            },
            {
                xtype : 'criterion_help_release_notes',
                scrollable : 'vertical'
            }
        ],

        initComponent : function() {
            var me = this;

            this.callParent(arguments);

            Ext.on('resize', this.updateSize, this);
            Ext.util.History.on('change', function() {
                me.isVisible() && me.fireEvent('show')
            })
        },

        toggle : function() {
            if (this.inAnimation) {
                return
            }

            if (this.isVisible()) {
                this.hide();
            } else {
                this.show();
            }
        },

        getControllButtons : function() {
            var controllButtons = this.controllButtons;

            if (!controllButtons) {
                this.controllButtons = controllButtons = Ext.create('criterion.ux.Panel', {
                    layout : 'vbox',
                    floating : true,

                    alwaysOnTop : 1,
                    shadow : 'frame',

                    renderTo : Ext.getBody(),

                    cls : 'criterion-help-control',

                    style : {
                        opacity : 0,
                        display : 'none'
                    },

                    items : [
                        {
                            xtype : 'segmentedbutton',
                            itemId : 'helpButtons',
                            layout : {
                                type : 'vbox'
                            },
                            listeners : {
                                toggle : 'onTabToggle',
                                scope : this.getController()
                            },
                            defaults : {
                                width : 50,
                                height : 50,
                                border : false
                            },
                            items : [
                                {
                                    tooltip : {
                                        text : i18n.gettext('Knowledge Base'),
                                        align : 'r-l?'
                                    },
                                    glyph : criterion.consts.Glyph['android-document'],
                                    cardIdx : 0,
                                    pressed : true
                                },
                                {
                                    tooltip : {
                                        text : i18n.gettext('Support'),
                                        align : 'r-l?'
                                    },
                                    glyph : criterion.consts.Glyph['help-circled'],
                                    cardIdx : 1
                                },
                                {
                                    tooltip : {
                                        text : i18n.gettext('New Idea'),
                                        align : 'r-l?'
                                    },
                                    glyph : criterion.consts.Glyph['ios7-color-wand'],
                                    gotoUrl : criterion.consts.Help.HELP_CENTER_SUGGESTION_TOPIC
                                },
                                {
                                    tooltip : {
                                        text : i18n.gettext('Release Notes'),
                                        align : 'r-l?'
                                    },
                                    glyph : criterion.consts.Glyph['ios7-paperplane-outline'],
                                    cardIdx : 2
                                }
                            ]
                        },
                        {
                            xtype : 'button',
                            cls : 'btn-close',
                            glyph : criterion.consts.Glyph['android-close'],

                            handler : 'onToolbarHide',
                            scope : this.getController(),

                            width : 50,
                            height : 50,
                            border : false
                        }
                    ]
                });
            }

            return controllButtons;
        },

        updateSize : function() {
            if (this.rendered) {
                var toolbar = Ext.first('criterion_moduletoolbar'),
                    controllButtons = this.getControllButtons();

                this.setHeight(Ext.dom.Element.getDocumentHeight() - toolbar.getSize().height);
                this.alignTo(Ext.getBody(), this.defaultAlign);
                controllButtons && controllButtons.alignTo(this.getEl(), 'tr-tl', [0, 50]);
            }
        },

        show : function() {
            this.callParent(arguments);
            this.el.shadow.hide();
        },

        beforeShow : function() {
            var me = this,
                controllButtons = this.getControllButtons();

            this.el.shadow.hide();
            this.el.setStyle({visibility : 'hidden'});

            this.inAnimation = true;
            this.el.slideIn('r', {
                callback : function() {
                    me.el.shadow.show();
                    if (controllButtons) {
                        controllButtons.setStyle({
                            display : 'block'
                        });
                        controllButtons.alignTo(me.getEl(), 'tr-tl', [0, 50]);
                        controllButtons.getEl().fadeIn({
                            callback : function() {
                                me.inAnimation = false;
                            }
                        });
                    } else {
                        me.inAnimation = false;
                    }
                }
            });

            return this.callParent(arguments);
        },

        hide : function() {
            var me = this,
                controllButtons = this.getControllButtons();

            this.inAnimation = true;
            if (controllButtons) {
                controllButtons.getEl().fadeOut({
                    duration : 0.4,
                    callback : function() {
                        me.el.slideOut('r', {
                            callback : function() {
                                me.superclass.hide.apply(me);
                                me.inAnimation = false;
                            }
                        });
                    }
                });
            } else {
                me.el.slideOut('r', {
                    callback : function() {
                        me.superclass.hide.apply(me);
                        me.inAnimation = false;
                    }
                });
            }

        },

        setWidth : function() {
            this.callParent(arguments);
            Ext.defer(this.updateSize, 10, this)
        }
    };

});
