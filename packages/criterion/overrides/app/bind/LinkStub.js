Ext.define('criterion.overrides.app.bind.LinkStub', {

    override : 'Ext.app.bind.LinkStub',

    getValue : function() {
        var binding = this.binding;

        return binding && binding.getRawValue();
    }
});
