/**
 * This plugin filters out container's items based on item's securityAccess property.
 *
 * The property can be specified as function or boolean value. If no securityAccess defined, default value will be used.
 */
Ext.define('criterion.plugin.SecurityItems', {

    extend : 'Ext.plugin.Abstract',

    alias : 'plugin.criterion_security_items',

    pluginId : 'criterionSecurityItems',

    _prepareItems : undefined,

    /**
     * True - everything not disallowed is allowed
     * False - everything not allowed is disallowed
     */
    secureByDefault : false,

    init : function(cmp) {
        this.callParent(arguments);
        this._prepareItems = cmp.prepareItems;
        this.cmp = cmp;
        cmp.prepareItems = Ext.Function.bind(this.beforePrepareItems, this);

        if (cmp.items && cmp.items.items) { // filtering out already instantiated items todo find out how to filter them before instatiation
            cmp.items.each(this.removeUnsecure, this);
        }
    },

    beforePrepareItems : function(items) {
        var args = Array.prototype.slice.call(arguments);

        args[0] = this.filterUnsecure(items);

        return this._prepareItems.apply(this.cmp, args);
    },

    hasAccess : function(item) {
        var access;

        if (Ext.isFunction(item.securityAccess)) {
            access = item.securityAccess();
        } else if (typeof item.securityAccess !== 'undefined') {
            access = item.securityAccess;
        } else {
            access = this.secureByDefault;
        }

       return access;
    },

    filterUnsecure : function(items) {
        if (!Ext.isArray(items)) {
            return items;
        }

        return Ext.Array.filter(items, function(item) {
            if (item) {
                return this.hasAccess(item)
            } else {
                return false
            }
        }, this)
    },

    removeUnsecure : function(item) {
        if (!this.hasAccess(item)) {
            this.cmp.remove(item);
        }
    }

});
