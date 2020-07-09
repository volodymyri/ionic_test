Ext.define('criterion.overrides.grid.plugin.RowExpander', {

    override: 'Ext.grid.plugin.RowExpander',

    getHeaderConfig : function() {
        return Ext.apply(this.callParent(arguments), {
            encodeHtml : false
        });
    }
});