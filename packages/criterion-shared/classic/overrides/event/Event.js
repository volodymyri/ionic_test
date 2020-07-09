Ext.define('criterion.overrides.event.Event', {

    override : 'Ext.event.Event',

    statics : {
        resolveTextNode : function(node) {
            if (!Object.getPrototypeOf(node)) { // <-- changed (fix for issue CRITERION-6285)
                return null;
            }

            return (node && node.nodeType === 3) ? node.parentNode : node;
        }
    }
});
