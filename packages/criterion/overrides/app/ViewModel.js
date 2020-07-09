Ext.define('criterion.overrides.app.ViewModel', {

    override : 'Ext.app.ViewModel',

    // Overriding Ext.app.ViewModel#getStub and Ext.app.ViewModel#get because execution crashes when parent view is destroyed

    get : function(path) {
        var stub = this.getStub(path);

        return stub ? stub.getValue() : null;
    },

    privates: {
        getStub : function(bindDescr) {
            var root = this.getRoot();

            return bindDescr ? (root && root.getChild && root.getChild(bindDescr)) : root;
        }
    }
});
