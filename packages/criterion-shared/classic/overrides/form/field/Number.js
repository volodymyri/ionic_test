Ext.define('criterion.overrides.form.field.Number', {

    override : 'Ext.form.field.Number',

    spinUpEnabled : false,
    spinDownEnabled : false,

    /**
     * Default option, see CRITERION-3247
     */
    selectOnFocus : true,

    config : {
        hideTrigger : true
    }
});
