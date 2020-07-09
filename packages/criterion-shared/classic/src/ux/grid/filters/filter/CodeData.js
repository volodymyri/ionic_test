Ext.define('criterion.ux.grid.filters.filter.CodeData', {

    extend : 'Ext.grid.filters.filter.List',

    alias : 'grid.filter.codedata',

    idField : 'id',

    labelField : 'description',

    labelIndex : 'id',

    constructor : function(config) {
        var me = this,
            store = criterion.CodeDataManager.getStore(config.column && config.column.codeDataId);

        config.options = [];

        if (!store.isLoaded()) {
            store.on('datachanged', function(st) {
                st.each(function(rec) {
                    config.options.push([
                        rec.get(me.idField),
                        Ext.String.htmlEncode(rec.get(me.labelField))
                    ]);
                });

                me.superclass.constructor.call(me, config);
            }, me, {single : true});
        } else {
            store.each(function(rec) {
                config.options.push([
                    rec.get(me.idField),
                    Ext.String.htmlEncode(rec.get(me.labelField))
                ]);
            });

            this.callParent([config]);
        }
    }
});

