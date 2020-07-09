Ext.define('criterion.overrides.selection.Model', {

    override : 'Ext.selection.Model',

    getSelection : function() {
        return this.selected && this.selected.getRange() || [];
    }
});