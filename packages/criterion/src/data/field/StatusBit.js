/**
 * Extract single bit value from {@link #referenceField} bit mask.
 */
Ext.define('criterion.data.field.StatusBit', function() {

    return {

        alias : 'data.field.criterion_status_bit',

        extend : 'Ext.data.field.Boolean',

        bitMask : null,

        referenceField : 'accessLevel',

        persist : false,

        depends : ['accessLevel'], // may break  if accessLevel is not defined

        convert : function(newValue, record) {
            var ref = record.getField(this.referenceField);

            if (!ref) {
                console && console.error('Referenced field ' + this.referenceField
                    + ' not found in ' + record.id);
                return null;
            }

            if (this.bitMask === null) {
                console && console.error('bitMask isn\'t set for field in ' + record.id);
                return null;
            }

            return !(~record.get(this.referenceField) & this.bitMask);
        }
    };

});
