Ext.define('criterion.overrides.promise.Consequence', {

    override : 'Ext.promise.Consequence',

    propagate : function(value, callback, deferred, deferredMethod) {
        if (Ext.isFunction(callback)) {
            this.schedule(function() {
                try {
                    deferred.resolve(callback(value));
                } catch (e) {
                    if (e instanceof Error) { // <-- changed (added logging such errors)
                        criterion.Log && criterion.Log.logError(e, 'promise.Consequence exception');
                    }

                    deferred.reject(e);
                }
            });
        } else {
            deferredMethod.call(this.deferred, value);
        }
    }
});
