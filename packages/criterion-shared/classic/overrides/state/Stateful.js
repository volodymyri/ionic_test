Ext.define('criterion.overrides.state.Stateful', {

    override : 'Ext.state.Stateful',

    /**
     * https://perfecthr.atlassian.net/browse/CRITERION-4366
     * EXT Bug - sometimes settings are not saved with default delay
     */
    saveDelay : 0,

    privates : {
        initState: function() {
            var me = this,
                id = me.stateful && me.getStateId(),
                hasListeners = me.hasListeners,
                state, combinedState, i, len, plugins, plugin, pluginType;

            if (id) {
                combinedState = Ext.state.Manager.get(id);

                if (Ext.isObject(combinedState) && !Ext.Object.isEmpty(combinedState)) { // <-- fixed
                    state = Ext.apply({}, combinedState);

                    if (!hasListeners.beforestaterestore ||
                        me.fireEvent('beforestaterestore', me, combinedState) !== false) {

                        // Notify all plugins FIRST (if interested) in new state
                        plugins = me.getPlugins() || [];

                        for (i = 0, len = plugins.length; i < len; i++) {
                            plugin = plugins[i];

                            if (plugin) {
                                pluginType = plugin.ptype;

                                if (plugin.applyState) {
                                    plugin.applyState(state[pluginType], combinedState);
                                }

                                // clean to prevent unwanted props on the component in final phase
                                delete state[pluginType];
                            }
                        }

                        me.applyState(state);

                        if (hasListeners.staterestore) {
                            me.fireEvent('staterestore', me, combinedState);
                        }
                    }
                }
            }
        }
    }
});
