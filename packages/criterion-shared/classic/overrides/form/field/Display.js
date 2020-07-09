Ext.define('criterion.overrides.form.field.Display', {

    override : 'Ext.form.field.Display',

    /**
     * Default option, see CR-9319
     */
    htmlEncode : true,

    // not need
    appendRequiredMark(cfg) {}

});
