Ext.define('criterion.view.ess.Help', function() {

    return {
        alias : 'widget.criterion_ess_help',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Help',
            'criterion.store.EssHelp'
        ],

        inAnimation : false,

        floating : true,

        alwaysOnTop : true,

        defaultAlign : 'br-br',

        scrollable : true,

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

        viewModel : {
            data : {
                record : null,
                helpButton : null,
                isViewJustInitialized : true
            },
            formulas : {
                title : function(get) {
                    var record = get('record');

                    return record && record.get('title') || i18n.gettext('Help')
                },
                content : function(get) {
                    var record = get('record');

                    return record && record.get('content') || i18n.gettext('No help available for this topic.')
                }
            },
            stores : {
                help_articles : {
                    type : 'criterion_ess_help',
                    autoLoad : true,

                    proxy : {
                        extraParams : {
                            isActive : true
                        }
                    }
                }
            }
        },

        bodyPadding : '25 20',

        controller : {
            type : 'criterion_ess_help'
        },

        listeners : {
            afterrender : 'onAfterRender',
            routeChange : 'handleRouteChange',
            hide : 'onChangeVisibility',
            show : 'onChangeVisibility'
        },

        header : {
            titlePosition : 0,
            titleAlign : 'center',

            bind : {
                title : '{title}'
            },

            defaults : {
                cls : 'criterion-btn-transparent',
                scale : 'medium',
                padding : 0
            },
            items : [
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['android-close'],
                    listeners : {
                        click : 'onToolbarHide'
                    }
                }
            ]
        },

        items : [
            {
                xtype : 'component',
                bind : {
                    html : '{content}'
                }
            }
        ],

        initComponent : function() {
            var me = this,
                vm = this.getViewModel();

            this.callParent(arguments);
            this.fireEvent('routeChange', true);

            Ext.on('resize', this.updateSize, this);

            Ext.util.History.on('change', function() {
                var _isViewJustInitialized = vm.get('isViewJustInitialized');

                if (!_isViewJustInitialized) {
                    me.fireEvent('routeChange', _isViewJustInitialized);
                }
            });
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

        updateSize : function() {
            if (this.rendered) {
                var toolbar = Ext.first('criterion_selfservice_module_toolbar');

                this.setHeight(Ext.dom.Element.getDocumentHeight() - toolbar.getSize().height);
                this.alignTo(Ext.getBody(), this.defaultAlign);
            }
        },

        show : function() {
            this.callParent(arguments);
            this.el.shadow.hide();
        },

        beforeShow : function() {
            var me = this;

            this.el.shadow.hide();
            this.el.setStyle({visibility : 'hidden'});

            this.inAnimation = true;
            this.el.slideIn('r', {
                callback : function() {
                    me.el.shadow.show();
                    me.inAnimation = false;
                }
            });

            return this.callParent(arguments);
        },

        hide : function() {
            var me = this;

            this.inAnimation = true;
            me.el.slideOut('r', {
                callback : function() {
                    me.superclass.hide.apply(me);
                    me.inAnimation = false;
                }
            });

        },

        setWidth : function() {
            this.callParent(arguments);
            Ext.defer(this.updateSize, 10, this)
        }

    }
});