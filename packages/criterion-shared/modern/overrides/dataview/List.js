Ext.define('criterion.overrides.dataview.List', {

    override : 'Ext.dataview.List',

    privates : {
        syncRowsToHeight : function(force) {
            if (!this.store) {
                return;
            }
            this.callParent(arguments);
        }
    }

});
