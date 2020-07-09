Ext.define('criterion.overrides.field.Picker', {

    override : 'Ext.field.Picker',

    expand : function() {
        if (!this.expanded && !this.getDisabled() && !this.getReadOnly()) {
            this.showPicker();
        }
    }

});
