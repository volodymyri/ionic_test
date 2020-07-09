Ext.define('criterion.overrides.form.Basic', {

    override : 'Ext.form.Basic',

    findField : function(id) {
        return this.getFields().findBy(function(f) {
            var result = (f.id === id || f.name === id || f.dataIndex === id) && f;

            // <- changed
            if (result) {
                return result;
            } else {
                return (f.hasBindingValue && f.bind.value.stub && f.bind.value.stub.name === id) && f;
            }
        });
    }
});
