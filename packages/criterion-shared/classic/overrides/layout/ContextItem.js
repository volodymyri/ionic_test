Ext.define('criterion.overrides.layout.ContextItem', {

    override : 'Ext.layout.ContextItem',

    flush : function() {
        if (this.el.destroyed) {

            this.dirtyCount = 0;

            delete this.dirty;
            delete this.attributes;
            delete this.innerHTML;

            return;
        }

        this.callParent(arguments);
    }

});
