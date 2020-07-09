Ext.define('criterion.data.TreeStore', function() {

    return {
        extend : 'Ext.data.TreeStore',

        loadWithPromise : function(opts) {
            var dfd = Ext.create('Ext.Deferred');

            if (opts.listenEvent) {
                this.on('load', function(store) {
                    dfd.resolve(store)
                }, this, {single : true});
            }

            this.load(Ext.apply(opts || {}, {
                callback : function(records, operation, success) {
                    if (!opts.listenEvent) {
                        dfd[success ? 'resolve' : 'reject'](records)
                    }
                }
            }));

            return dfd.promise;
        }

    };

});
