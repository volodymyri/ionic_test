Ext.define('criterion.ux.form.field.plugin.DisplayOnly', {

    extend : 'Ext.plugin.Abstract',

    alias : 'plugin.criterion_display_only',

    pluginId : 'criterion_display_only',

    hideTriggers : true,

    grow : true,

    constructor : function(config) {
        if (config && config.cmp) {
            config.cmp.readOnlyCls = '';
            config.cmp.grow = this.grow;
            config.cmp.addCls('criterion-display-only-field');
        }

        this.callParent(arguments);
    },

    init : function(cmp) {
        this.hideTriggers && cmp.getTriggers && Ext.Object.each(cmp.getTriggers(), function(trigger) {
            trigger.hide && trigger.hide();
        });

        cmp.setReadOnly(true);

        this.callParent(arguments);
    }
});
