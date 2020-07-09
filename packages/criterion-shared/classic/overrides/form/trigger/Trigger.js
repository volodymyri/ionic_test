Ext.define('criterion.overrides.form.trigger.Trigger', {

    override : 'Ext.form.trigger.Trigger',

    /**
     * @protected
     * Handles a click on the trigger's element
     */
    onClick : function() {
        var me = this,
            args = arguments,
            e = me.clickRepeater ? args[1] : args[0],
            handler = me.handler,
            field = me.field;

        if (handler && (!field.readOnly || field.enableTriggerClickOnReadOnly) && me.isFieldEnabled()) { // <- changed
            Ext.callback(me.handler, me.scope, [field, me, e], 0, field);
        }
    }

});
