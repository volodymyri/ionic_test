Ext.define('criterion.overrides.form.Panel', {

    override : 'Ext.form.Panel',

    isValid : function() {
        var invalid = [];

        Ext.suspendLayouts();

        Ext.Array.each(this.getFieldsAsArray(), function(field) {
            !field.validate() && invalid.push(field);
        });

        Ext.resumeLayouts(true);

        return invalid.length < 1;
    },

    rejectInvalidFields : Ext.emptyFn,

    getFieldsAsArray : function() {
        var fields = this.getFields(),
            aFields = [],
            name;

        for (name in fields) {
            if (fields.hasOwnProperty(name)) {
                if (!Ext.isArray(fields[name])) {
                    aFields.push(fields[name]);
                } else {
                    aFields = Ext.Array.merge(aFields, fields[name])
                }
            }
        }

        return aFields;
    },

    focusOnInvalidField : function() {
        let eField;

        this.getFields(false).forEach(function(field) {
            if (!eField && field.isValid && !field.isValid()) {
                eField = field;
            }
        });

        eField && eField.focus();
    }
});
