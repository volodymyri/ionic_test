Ext.define('criterion.overrides.form.field.Checkbox', {

    override : 'Ext.form.field.Checkbox',

    /**
     * Default option, see CRITERION-4553
     */
    uncheckedValue : false

});
