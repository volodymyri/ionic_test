Ext.define('criterion.overrides.util.History', {

    override : 'Ext.util.History',

    prevHash : null,
    detectChanges : true,

    /**
     * Immediately trigger hashChange, used in tests.
     */
    immediateHashChange : false,

    add : function(token, preventDuplicates) {
        this.callParent(arguments);
        this.immediateHashChange && this.onHashChange();
    },

    onHashChange : function() {
        this.prevHash = this.hash;

        if (this.detectChanges && Ext.GlobalEvents.fireEvent('beforeHideForm', this, arguments) === false) {
            this.hash = this.prevHash;
            this.detectChanges = false;

            return;
        } else {
            this.detectChanges = true;
            this.callParent(arguments);
        }
    }
});
