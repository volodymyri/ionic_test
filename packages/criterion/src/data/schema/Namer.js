Ext.define('criterion.data.schema.Namer', {

    alias: 'namer.criterion_default',

    extend : 'Ext.data.schema.Namer',

    /**
     * Returns local name of Class.
     *
     * @param name
     * @returns
     */
    localname : function(name) {
        return name.split('.').pop();
    },


    multiRole: function (name) {
        return this.apply('localname,uncapitalize,pluralize', name);
    }

});
