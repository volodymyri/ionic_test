Ext.define('ess.view.MenuBar', function() {

    var BUTTON_TYPE = {
        mainMenu : {
            xtype : 'button',
            itemId : 'menuButton',
            cls : 'criterion-menubar-menu-btn',
            align : 'left'
        },
        back : {
            xtype : 'button',
            itemId : 'backButton',
            cls : 'criterion-menubar-back-btn',
            iconCls : 'md-icon-arrow-back',
            align : 'left'
        }
    };

    return {
        extend : 'Ext.TitleBar',

        alias : 'widget.ess_modern_menubar',

        mainMenu : false,

        actions : [],
        buttons : [],

        docked : 'top',

        cls : 'ess-modern-menubar',

        config : {
            titleAlign : 'center'
        },

        toggleMainMenu : function() {
            Ext.GlobalEvents.fireEvent('toggleMainMenu');
        },

        mainMenuAction : function() {
            Ext.GlobalEvents.fireEvent('signOutAction');
        },

        onBackButton : Ext.emptyFn,

        toggleNavMode : function(backFunc, scope) {
            var me = this;

            if (backFunc) {
                this.onBackButton = function() {
                    backFunc.apply(scope || me);
                    Ext.GlobalEvents.fireEvent('menuBackAction');
                    me.toggleNavMode();
                };

                this.down('#menuButton').hide();
                this.down('#backButton').show();
            } else {
                this.onBackButton = Ext.emptyFn;
                this.down('#menuButton').show();
                this.down('#backButton').hide();
            }
        },

        defNavMode : function() {
            this.onBackButton = Ext.emptyFn;
            this.down('#menuButton').show();
            this.down('#backButton').hide();
        },

        constructor : function(config) {
            var parent = config.$initParent,
                buttons;

            if (config.buttons) {   // custom buttons
                for (var i = 0; i < config.buttons.length; i++) {
                    var button = config.buttons[i],
                        preset = BUTTON_TYPE[button.type];

                    if (preset) {
                        config.buttons[i] = Ext.apply({}, preset, button);
                    }
                }

                buttons = config.buttons
            } else {    // legacy buttons
                buttons = [
                    Ext.apply({}, BUTTON_TYPE.mainMenu, {
                        iconCls : config.mainMenu ? 'x-fa fa-sign-out' : 'md-icon-menu',
                        listeners : {
                            scope : this,
                            tap : config.mainMenu ? 'mainMenuAction' : 'toggleMainMenu'
                        }
                    }),
                    Ext.apply({}, BUTTON_TYPE.back, {
                        hidden : true,
                        listeners : {
                            scope : this,
                            tap : 'onBackButton'
                        }
                    })
                ];

                if (config.mainMenu) {
                    buttons.push({
                        xtype : 'button',
                        cls : 'criterion-menubar-user-icon',
                        align : 'right',
                        icon : criterion.Utils.makePersonPhotoUrl(criterion.Api.getCurrentPersonId(), criterion.Consts.USER_PHOTO_SIZE.TOOLBAR_ICON_WIDTH, criterion.Consts.USER_PHOTO_SIZE.TOOLBAR_ICON_HEIGHT),
                        listeners : {
                            scope : this,
                            tap : function() {
                                Ext.GlobalEvents.fireEvent('showMyProfile');
                            }
                        }
                    })
                }
            }

            if (config.actions) {
                for (var i = 0; i < config.actions.length; i++) {
                    config.actions[i].align = 'right';
                }
            }

            config.items = Ext.Array.merge(buttons, config.actions || []);

            this.callParent(arguments);

            this.setTitle(config.title || (Ext.isFunction(parent.getTitle) ? parent.getTitle() : null));
        }
    }
});
