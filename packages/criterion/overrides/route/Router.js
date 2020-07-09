Ext.define('criterion.overrides.route.Router', {

    override : 'Ext.route.Router',

    requires : [
        'criterion.Log'
    ],

    onRouteRejection : function(route, error) {
        Ext.fireEvent('routereject', route, error);

        if (error) {
            criterion.Log.logError(error, 'onRouteRejection');
            // not need to rise this error after logging
            // Ext.raise(error);
        }
    }

});
