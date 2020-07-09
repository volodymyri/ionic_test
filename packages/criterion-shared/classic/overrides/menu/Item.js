Ext.define('criterion.overrides.menu.Item', {

    override : 'Ext.menu.Item',

    initComponent : function() {
        this.callParent();

        /*
         * Part of solution D2-8. For touch devices with small resolution menuitem hyperlink may not fire
         * but click works, so if redirection doesn't happen in short period then try to force it
         */
        this.on('click', function(item) {
            if (item.href && Ext.platformTags.touch && location.origin + item.href !== location.href) {
                item.itemEl.dom.click();
            }
        }, this, {
            delay : 100
        });
    }
});
