Ext.define('criterion.overrides.Container', {

    override : 'Ext.Container',

    setLoading : function(state) {
        this.setMasked(state ?
            {
                xtype : 'loadmask'
            } : false
        );
    }
});