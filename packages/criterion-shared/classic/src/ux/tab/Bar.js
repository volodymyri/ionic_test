/**
 * TabBar is used internally by a {@link Ext.tab.Panel TabPanel} and typically should not
 * need to be created manually.
 */
Ext.define('criterion.ux.tab.Bar', function() {

    return {
        alternateClassName : [
            'criterion.tab.Bar'
        ],

        alias : 'widget.criterion_tabbar',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        extend : 'Ext.tab.Bar',

        requires : [
            'criterion.ux.tab.Tab'
        ],

        minWidth : criterion.Consts.UI_DEFAULTS.TABBAR_MIN_WIDTH,

        margin : '0 1 0 0',

        initComponent : function() {
            var me = this,
                tabPosition = this.tabPanel.getTabPosition();

            // overriding private method - don't try it at home
            this.onClick = this.onClickCustom;

            this.addCls('criterion-tab-bar-' + tabPosition);

            me.callParent(arguments);
        },

        onClickCustom : function(e, target) {
            var me = this,
                tabEl, tab, isCloseClick, tabInfo;

            if (e.getTarget('.' + Ext.baseCSSPrefix + 'box-scroller')) {
                return;
            }

            if (Ext.isIE8 && me.vertical) {
                tabInfo = me.getTabInfoFromPoint(e.getXY());
                tab = tabInfo.tab;
                isCloseClick = tabInfo.close;
            } else {
                // The target might not be a valid tab el.
                tabEl = e.getTarget('.' + Ext.tab.Tab.prototype.baseCls);
                tab = tabEl && Ext.getCmp(tabEl.id);
                isCloseClick = tab && tab.closeEl && (target === tab.closeEl.dom);
            }

            if (isCloseClick) {
                e.preventDefault();
            }

            if (tab && !tab.collapsible && Ext.GlobalEvents.fireEvent('beforeHideForm', this, arguments) === false) {
                return false;
            }

            if (tab && tab.isDisabled && !tab.isDisabled()) {
                // This will focus the tab; we do it before activating the card
                // because the card may attempt to focus itself or a child item.
                // We need to focus the tab explicitly because click target is
                // the Bar, not the Tab.
                tab.beforeClick(isCloseClick);

                if (tab.closable && isCloseClick) {
                    tab.onCloseClick();
                } else if (tab.collapsible) {
                    this.tabPanel.toggleSubMenu(tab.card);
                } else {
                    me.doActivateTab(tab);
                }
            }
        }

    };
});
