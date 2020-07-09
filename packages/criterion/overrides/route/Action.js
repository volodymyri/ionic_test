Ext.define('criterion.overrides.route.Action', {

    override : 'Ext.route.Action',

    /**
     * Executes the next {@link #befores} or {@link #actions} function. If {@link #stopped}
     * is `true` or no functions are left to execute, the {@link #done} function will be called.
     *
     * @private
     * @return {Ext.route.Action} this
     */
    next : function() {
        var me = this,
            actions = me.getActions(),
            befores = me.getBefores(),
            urlParams = me.getUrlParams(),
            config, ret, args;

        if (Ext.isArray(urlParams)) {
            args = urlParams.slice();
        } else {
            args = [urlParams];
        }

        if (
            me.stopped ||
            (befores ? !befores.length : true) &&
            (actions ? !actions.length : true)
        ) {
            me.done();
        } else {
            if (befores && befores.length) {
                config = befores.shift();

                args.push(me);

                ret = Ext.callback(config.fn, config.scope, args);

                if (ret && ret.then && !ret.destroyed) { // <-- changed
                    ret.then(function(arg) {
                        me.resume(arg)
                    }, function(arg) {
                        me.stop(arg);
                    });
                }
            } else if (actions && actions.length) {
                config = actions.shift();

                Ext.callback(config.fn, config.scope, args);

                me.next();
            } else {
                //needed?
                me.next();
            }
        }

        return me;
    }

});
