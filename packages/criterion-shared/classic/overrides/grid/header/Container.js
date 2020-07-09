Ext.define('criterion.overrides.grid.header.Container', {

    override : 'Ext.grid.header.Container',

    itemSeparatorDisabled : false,

    beforeMenuShow : function(menu) {
        this.callParent(arguments);

        var separator = menu.child('#columnItemSeparator');

        this.itemSeparatorDisabled && separator && !separator.isHidden() && separator.hide();
    }
});
