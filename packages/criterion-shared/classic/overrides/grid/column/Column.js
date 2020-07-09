Ext.define('criterion.overrides.grid.column.Column', {

    override : 'Ext.grid.column.Column',

    /**
     * {@link Ext.grid.column.Column#producesHTML} should solve it. But it works only when cell has been updated after initial rendered state.
     *
     * Modern has encodeHtml cfg parameter. Let's add the same here.
     **/

    encodeHtml : true,

    initComponent : function() {
        this.producesHTML = !this.encodeHtml;

        this.callParent(arguments);
    }
});