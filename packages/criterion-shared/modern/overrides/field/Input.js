Ext.define('criterion.overrides.field.Input', {

    override : 'Ext.field.Input',

    readOnlyCls : Ext.baseCSSPrefix + 'readonly',

    setReadOnly : function(value) {
        this.callParent(arguments);
        this[value ? 'addCls' : 'removeCls'](this.readOnlyCls);
    }
});
