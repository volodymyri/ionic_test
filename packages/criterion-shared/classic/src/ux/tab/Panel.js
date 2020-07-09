Ext.define('criterion.ux.tab.Panel', function() {

    const POS_CLASSES = ['top_pos', 'left_pos', 'right_pos', 'bottom_pos'];

    return {
        alternateClassName : [
            'criterion.ux.TabPanel',
            'criterion.TabPanel',
            'criterion.ux.TabPanel'
        ],

        alias : 'widget.criterion_tabpanel',

        extend : 'Ext.tab.Panel',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        requires : [
            'criterion.ux.tab.Bar',
            'criterion.ux.tab.Tab'
        ],

        updateTabPosition(pos) {
            this.removeCls(POS_CLASSES);
            this.addCls(pos + '_pos');

            this.callParent(arguments);
        },

        /**
         * @cfg {Boolean} sort items in submenu by title
         */
        sortSubItems : false,

        /**
         * @cfg {Boolean} if false hide headers from child items
         */
        showHeaders : false,

        tabPosition : 'left',
        tabRotation : 0,

        tabBar : {
            xtype : 'criterion_tabbar',

            defaults : {
                margin : 0
            }
        },

        showFilter : false,
        filterInsertIndex : 0,
        focusFilter : false,
        filterValue : null,
        activeTabs : Ext.create('Ext.util.Collection'),

        viewModel : {
            data : {
                fullPageMode : false
            }
        },

        initComponent : function() {
            let me = this;

            me.callParent(arguments);

            me.showFilter && me.focusFilter && me.on({
                show : function() {
                    var filterMenu = me.lookup('filterMenu');
                    filterMenu && filterMenu.focus(false, 100);
                }
            });

            me.getViewModel().bind('{fullPageMode}', me.onFullPageMode, me);
        },

        onFullPageMode(fullPageMode) {
            fullPageMode ? this.tabBar.hide() : this.tabBar.show();
        },

        /**
         * Overridden to allow custom TabBar components.
         *
         * @param tabBar
         * @returns {Ext.Component}
         */
        applyTabBar : function(tabBar) {
            var me = this,
                // if we are rendering the tabbar into the panel header, use same alignment
                // as header position, and ignore tabPosition.
                dock = (me.tabBarHeaderPosition != null) ? me.getHeaderPosition() : me.getTabPosition();

            return Ext.ComponentManager.create(Ext.apply({
                xtype : 'criterion_tabbar',
                ui : me.ui,
                dock : dock,
                tabRotation : me.getTabRotation(),
                vertical : (dock === 'left' || dock === 'right'),
                plain : me.plain,
                tabStretchMax : me.getTabStretchMax(),
                tabPanel : me
            }, tabBar));
        },

        subItemsOffset : 0,

        setActiveTab : function(item) {
            this.callParent(arguments);

            if (item.isSubMenu) {
                var activeItem = item.getLayout().getActiveItem();

                if (activeItem) {
                    this.toggleSubItemTab(activeItem);
                    activeItem.fireEvent('activate', activeItem);
                }
            }
        },

        /**
         * @public
         * @param cardIdent
         */
        setSubMenuActiveTab : function(cardIdent) {
            var card = this.getActiveTab(),
                cardLayout = card.getLayout();

            if (card.isSubMenu) {
                cardLayout.setActiveItem(cardIdent || 0);
                this.toggleSubItemTab(cardLayout.getActiveItem());
            }
        },

        /**
         * @param card
         * @param [state]
         */
        toggleSubMenu : function(card, state) {
            var explicitState = (arguments.length === 2);

            this.tabBar.items.each(function(tab) {
                if (tab.parentCard === card && !tab.isSectionLabel) {
                    var hidden = explicitState ? !state : !tab.hidden;

                    tab.setHidden(hidden);
                    card.tab[hidden ? 'removeCls' : 'addCls']('expanded');
                    card.tab.expanded = !hidden;
                }
            });

            this.showFilter && this.updateFilter(this.filterValue);
        },

        onSubItemTabClick : function(item, subItem) {
            if (item.getLayout().getActiveItem() !== subItem) {
                if (Ext.GlobalEvents.fireEvent('beforeHideForm', this, arguments) === false) {
                    return false;
                }

                // CRITERION-6177, prevent multiple times data requesting
                subItem.suspendEvent('activate');
                item.setActiveItem(subItem);
                subItem.resumeEvent('activate'); //activate will be thrown later, when "item" will be active

            } else if (subItem.rendered) { // if not rendered, layout will fire activate on boxready
                if (subItem.fireEvent('beforeactivate', subItem) === false) {
                    return false;
                }
            }
        },

        /**
         * @private
         * @param subItem
         */
        onSubItemBeforeActivate : function(subItem) {
            this.toggleSubItemTab(subItem);
            this.fireEvent('childTabChange', this, subItem, subItem.tab.parentCard);
        },

        /**
         * @private
         * @param subItem
         */
        toggleSubItemTab : function(subItem) {
            if (!subItem) {
                return;
            }
            this.tabBar.setActiveTab(subItem.tab);
            this.toggleSubMenu(subItem.tab.parentCard, true);
        },

        getDefaultConfig : function(item) {
            var tabBar = this.getTabBar(),
                defaultConfig = {
                    xtype : 'criterion_tab',
                    title : item.title,
                    icon : item.icon,
                    iconCls : item.iconCls,
                    glyph : item.glyph,
                    ui : tabBar.ui,
                    card : item,
                    disabled : item.disabled,
                    closable : item.closable,
                    hidden : item.hidden && !item.hiddenByLayout, // only hide if it wasn't hidden by the layout itself
                    tooltip : item.tooltip,
                    tabBar : tabBar,
                    tabPosition : tabBar.dock,
                    rotation : tabBar.getTabRotation()
                };

            if (this.useHref) {
                Ext.apply(defaultConfig, {
                    href : '',
                    hrefTarget : '_self'
                });
            }

            return defaultConfig
        },

        /**
         * Overridden to allow sub-items.
         *
         * @param item
         * @param index
         */
        onAdd : function(item, index) {
            var me = this,
                cfg = Ext.apply({}, item.tabConfig),
                defaultConfig = this.getDefaultConfig(item);

            if (item.closeText !== undefined) {
                defaultConfig.closeText = item.closeText;
            }

            if (item.isSubMenu) {
                cfg.collapsible = Ext.isDefined(cfg.collapsible) ? cfg.collapsible : true;
                cfg.expanded = cfg.collapsible ? !!cfg.expanded : true;
            }

            if (cfg.sectionLabel) {
                me.tabBar.insert(index + this.subItemsOffset, {
                    xtype : 'component',
                    html : cfg.sectionLabel,
                    cls : 'x-tab-section-label',
                    parentCard : item,
                    isSectionLabel : true
                });

                this.subItemsOffset++;
            }

            if (index === me.filterInsertIndex && me.showFilter) {
                me.tabBar.insert(index + this.subItemsOffset, {
                    xtype : 'textfield',
                    emptyText : i18n.gettext('Filter Menu'),
                    reference : 'filterMenu',
                    parentCard : item,
                    isSectionLabel : true,
                    padding : '26 0 0 0',

                    cls : 'criterion-side-field criterion-hide-default-clear',
                    triggers : {
                        clear : {
                            type : 'clear',
                            cls : 'criterion-clear-trigger-transparent',
                            hideWhenEmpty : true
                        }
                    },
                    listeners : {
                        change : function(field, value, oldValue) {
                            me.filterValue = value;
                            me.updateFilter(value, oldValue);
                        }
                    }
                });
                this.subItemsOffset++;
            }

            cfg = Ext.applyIf(cfg, defaultConfig);

            // Create the corresponding tab in the tab bar
            item.tab = me.tabBar.insert(index + this.subItemsOffset, cfg);

            // Create subitems
            if (item.isSubMenu) {
                me.sortSubItems && item.items.sort(function(subItem1, subItem2) {
                    let compare = 0;

                    if (Ext.isString(subItem1.title) && Ext.isString(subItem2.title)) {
                        compare = criterion.Utils.decodeHtmlEntities(subItem1.title).localeCompare(criterion.Utils.decodeHtmlEntities(subItem2.title));
                    }

                    return compare;
                });

                item.items.each(function(subItem) {
                    this.insertSubItemTab(item, subItem, index + this.subItemsOffset + 1);
                    this.subItemsOffset++;
                }, this);

                item.on({
                    scope : me,
                    add : me.onSubItemAdd,
                    remove : me.onSubItemRemove
                })
            }

            item.on({
                scope : me,
                enable : me.onItemEnable,
                disable : me.onItemDisable,
                beforeshow : me.onItemBeforeShow,
                iconchange : me.onItemIconChange,
                iconclschange : me.onItemIconClsChange,
                glyphchange : me.onItemGlyphChange,
                titlechange : me.onItemTitleChange
            });

            if (item.isPanel) {
                if (!me.showHeaders) {
                    if (item.rendered) {
                        if (item.header) {
                            item.header.hide();
                        }
                    } else {
                        item.header = false;
                    }
                }

                if (item.isPanel && me.border) {
                    item.setBorder(false);
                }
            }

            // Force the view model to be created, see onRender
            if (me.rendered) {
                item.getBind();
            }

            // Ensure that there is at least one active tab. This is only needed when adding tabs via a loader config, i.e., there
            // may be no pre-existing tabs. Note that we need to check if activeTab was explicitly set to `null` in the tabpanel
            // config (which tells the layout not to set an active item), as this is a valid value to mean 'do not set an active tab'.
            if (me.rendered && me.loader && me.activeTab === undefined && me.layout.activeItem !== null) {
                me.setActiveTab(0);
            }
        },

        insertSubItemTab : function(parentItem, subItem, index) {
            var tabConfig,
                me = this;

            tabConfig = Ext.applyIf({
                title : subItem.title,
                card : subItem.card,
                subItem : subItem,
                parentCard : parentItem,
                cls : 'sub-item',
                isSubItem : true,
                hidden : !parentItem.tab.expanded,
                listeners : {
                    scope : this,
                    click : function() {
                        if (!this.useHref) {
                            this.onSubItemTabClick(parentItem, subItem);
                        }

                        this.fireEvent('childTabClick', this, subItem, parentItem);
                    }
                }
            }, this.getDefaultConfig(parentItem));

            if (subItem.isMultiPositionMode) { // todo fixme - move away from base component
                tabConfig.isMultiPositionMode = true;
            }

            if (subItem.multiPositionTitle) { // todo fixme - move away from base component
                tabConfig.multiPositionTitle = subItem.multiPositionTitle;
            }

            if (me.useHref) {
                tabConfig.href = '#' + (me.baseHref ? me.baseHref + '/' : '')
                    + me.reference + '/' + parentItem.reference + '/' + (subItem.reference || i);
            }

            subItem.on('beforeactivate', this.onSubItemBeforeActivate, this);
            subItem.tab = me.tabBar.insert(index, tabConfig);
        },

        onRemove : function(item, destroying) {
            var me = this;

            if (item.tab && !me.destroying && item.tab.ownerCt === me.tabBar) {
                if (item.isSubMenu) {
                    this.tabBar.items.each(function(tab) {
                        if (tab.parentCard === item) {
                            this.tabBar.remove(tab);
                        }
                    }, this)
                }
            }

            this.callParent(arguments);
        },

        onSubItemAdd : function(parentCard, subItemCard) {
            // try to keep indices in right order
            var parentTabIndex = this.tabBar.items.indexOf(parentCard.tab),
                subItemIndex = parentCard.items.indexOf(subItemCard),
                subItemTabsCount = 0,
                idx;

            this.tabBar.items.each(function(tab) {
                if (tab.parentCard === parentCard) {
                    subItemTabsCount++;
                }
            }, this);

            if (subItemIndex > subItemTabsCount) {
                idx = parentTabIndex + subItemTabsCount + 1
            } else {
                idx = parentTabIndex + subItemIndex + 1
            }

            this.insertSubItemTab(parentCard, subItemCard, idx);
        },

        onSubItemRemove : function(parentCard, subItemCard) {
            this.tabBar.remove(subItemCard.tab);
        },

        updateFilter : function(value, oldValue) {
            var activeTabs = this.activeTabs;

            this.suspendLayouts();
            if (value && !oldValue) {
                this.tabBar.items.each(function(item) {
                    if (item.parentCard && item.title && item.isVisible()) {
                        !activeTabs.contains(item) && activeTabs.add(item)
                    }
                });
            }
            if (value) {
                this.tabBar.items.each(function(item) {
                    if (item.notFilterable) {
                        return;
                    }

                    if (item.isSubItem && item.title && item.title.toLowerCase().indexOf(value.toLowerCase()) == -1) {
                        item.hide();
                    } else {
                        item.show();
                    }
                });
            } else if (oldValue) {
                this.tabBar.items.each(function(item) {
                    if (item.isSubItem && item.title) {
                        item.hide();
                    }
                });
                activeTabs.each(function(item) {
                    item.show();
                });
                activeTabs.clear();
            }
            this.resumeLayouts();
            this.updateLayout();
        }

    };

});
