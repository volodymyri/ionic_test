Ext.define('criterion.controller.mixin.ReRouting', {

    mixinId : 'criterion_re_routing',

    needToReRoute : null,

    setReRouting : function() {
        var view = this.getView();

        view.on('beforerender', function() { // late routing, caused by lazy items / deferred render
            if (criterion.Utils.routerRecognizeFor(Ext.History.getToken(), this).length) {
                this.needToReRoute = Ext.History.getToken();

                view.on('afterrender', this.reRoute, this, {single : true, buffer : 1});
            }
        }, this, {single : true});
    },

    reRoute : function() {
        // check if we need to reroute and token weren't changed
        if (Ext.History.getToken() === this.needToReRoute) {
            Ext.route.Router.onStateChange(Ext.History.getToken());
        }

        this.needToReRoute = false;
    }
});
