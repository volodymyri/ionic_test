Ext.define('criterion.overrides.form.field.Field', {

    override : 'Ext.form.field.Field',

    disableDirtyCheck : false,

    isDirty : function() {
        var me = this;

        if (me.disableDirtyCheck) {
            return false;
        }

        if (me.xtype === 'criterion_customdata_field') {
            return !me.disabled && !me.isEqualAsString(me.getValue(), me.originalValue);
        } else if (me.xtype === 'criterion_filefield') {
            if (me.fileInputEl) {
                return !!me.fileInputEl.getValue();
            } else {
                return false;
            }
        } else {
            /**
             * Added readOnly and hidden checks to the original
             * @see Ext.form.field.Field.isDirty
             */
            return !me.readOnly && !me.hidden && !me.disabled && !me.isEqual(me.getValue(), me.originalValue);
        }
    },

    setValue : function(value) {
        this.callParent(arguments);

        //Resetting initial value. Required for dirty forms and associated data as well.
        if (this.bind && this.bind.value && this.bind.value.stub && this.bind.value.stub.parentValue && !this.bind.value.stub.parentValue.dirty) {
            this.resetOriginalValue();
        }
    },

    getErrors : function(value) {
        var res = this.callParent(arguments);

        return Ext.Array.unique(res);
    }

});
