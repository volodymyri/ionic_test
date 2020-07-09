Ext.define('criterion.ux.form.field.plugin.HiddenValue', {

    extend : 'Ext.plugin.Abstract',

    alias : 'plugin.criterion_hidden_value',

    pluginId : 'criterion_hidden_value',

    hiddenStateCls : 'criterion-hidden-value-hidden-state',

    init : function(cmp) {
        if (this.destroyed) {
            return;
        }

        this.hiddenValue = false;

        cmp.setTriggers(Ext.apply(
            cmp.getTriggers(),
            {
                hideTrigger : {
                    cls : 'hide-value-trigger',
                    hideOnReadOnly : false,
                    weight : -1,
                    handler : this.onHideTrigger,
                    scope : this
                }
            }
        ));

        this.callParent(arguments);
        if (this.cmp) {
            this.cmp.addCls(this.hiddenStateCls);
        }
    },

    onHideTrigger : function() {
        if (this.destroyed) {
            return;
        }

        if (this.cmp) {
            this.getCmp()[this.hiddenValue ? 'removeCls' : 'addCls'](this.hiddenStateCls);
            if (this.hiddenValue) {
                this.getCmp().focus();
            }
            this.hiddenValue = !this.hiddenValue;
        }
    },

    switchOff : function() {
        if (this.destroyed) {
            return;
        }

        var cmp = this.getCmp();

        cmp.removeCls(this.hiddenStateCls);
        cmp.getTrigger('hideTrigger').hide();
    },

    hideValue : function() {
        if (this.destroyed) {
            return;
        }

        this.getCmp().addCls(this.hiddenStateCls);
        this.hiddenValue = true;
    }
});
