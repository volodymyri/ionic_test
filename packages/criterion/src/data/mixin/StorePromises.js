Ext.define('criterion.data.mixin.StorePromises', function() {

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : 'storePromises'
        },

        syncWithPromise(params) {
            let dfd = Ext.create('Ext.Deferred');

            if (this.getModifiedRecords().length || this.getRemovedRecords().length) {
                this.sync({
                    scope : dfd,
                    success : dfd.resolve,
                    failure : dfd.reject,
                    params : Ext.apply({}, params)
                });
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        loadWithPromise(opts) {
            let dfd = Ext.create('Ext.Deferred');

            if (opts && opts.skipIfLoaded && this.isLoaded()) {
                dfd.resolve();
            }

            this.load(Ext.apply(opts || {}, {
                callback : function(records, operation, success) {
                    dfd[success ? 'resolve' : 'reject'](records)
                }
            }));

            return dfd.promise;
        },

        waitUntilLoaded() {
            let dfd = Ext.create('Ext.Deferred');

            if (this.isLoading()) {
                this.on('load', function() {
                    dfd.resolve(this);
                }, this, { single: true });
            } else {
                dfd.resolve(this);
            }

            return dfd.promise;
        }

    };

});
