Ext.define('criterion.overrides.ux.toolbar.ToolbarPaging', {

    override : 'criterion.ux.toolbar.ToolbarPaging',

    getPagingItems : function() {
        var pagingItems = this.callParent(arguments),
            inputItem = Ext.Array.findBy(pagingItems, function(item) {
                return item.itemId === 'inputItem'
            });

        if (inputItem) {
            inputItem.msgTarget = 'qtip';
        }

        return pagingItems;
    }
});