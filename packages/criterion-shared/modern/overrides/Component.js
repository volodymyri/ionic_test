Ext.define('criterion.overrides.Component', {

    override : 'Ext.Component',

    getXType : function() {
        return this.xtype;
    },

    constructor : function(config) {
        this.callParent(arguments);

        //<debug>
        if (!criterion.PRODUCTION && this.el) {
            this.el.set({
                'data-cls-name' : Ext.getClassName(this)
            });
        }
        //</debug>
    }
});
