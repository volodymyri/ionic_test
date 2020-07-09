Ext.define('criterion.view.employee.TabBar', function() {

    return {

        extend : 'criterion.ux.tab.Bar',

        alias : 'widget.criterion_employee_tabbar',

        tabHeight : 40,

        setTabsDisabled(block) {
            this.items.each((item, idx) => {
                if (idx > 2) {
                    item.setDisabled(block);
                }
            });
        },

        controlTabBySubItemXtype(xtype, close) {
            let tabToCLose,
                me = this;

            this.items.each(item => {
                if (item.subItem && item.subItem.xtype === xtype) {
                    tabToCLose = item;
                }
            });

            if (tabToCLose) {
                if (close) {
                    tabToCLose.disable();
                    tabToCLose.addCls('x-hidden');
                    tabToCLose.setHeight(0);
                } else {
                    tabToCLose.enable();
                    tabToCLose.removeCls('x-hidden');
                    tabToCLose.setHeight(me.tabHeight);
                }
                me.updateLayout();
            }
        }

    }
});
