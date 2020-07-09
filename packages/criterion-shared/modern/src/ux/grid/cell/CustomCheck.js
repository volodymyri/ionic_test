Ext.define('criterion.ux.grid.cell.CustomCheck', {

    extend : 'Ext.grid.cell.Check',
    xtype : 'criterion_custom_checkcell',

    updateRecord : function(record) {
        this.callParent(arguments);

        if (record && Ext.isFunction(this.skipFn) && this.skipFn(record)) {
            this.disable();
        }
    }

});

