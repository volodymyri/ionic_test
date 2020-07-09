/**
 * Holds value from referenced codedata field.
 */
Ext.define('criterion.data.field.CodeDataValue', function() {

    return {
        extend : 'Ext.data.field.String',

        alias : [
            'data.field.criterion_codedatavalue',
            'data.field.codedatavalue'
        ],

        referenceField : null,
        dataProperty : 'description',

        persist : false,

        constructor : function(config) {
            config.depends = Ext.Array.merge(config.depends || [], [config.referenceField]);
            this.callParent(arguments);
        },

        convert : function(newValue, model) {
            var ref = model.getField(this.referenceField),
                record;

            if (!ref) {
                console && console.error('Referenced field ' + this.referenceField
                + ' not found in ' + model.id);
                return null;
            }

            if (!ref.getCodeDataId) {
                console && console.error('Referenced field ' + this.referenceField
                + ' isn\'t a codedata field');
                return null;
            }

            if (!model.get(ref.name)) {
                return null;
            }

            record = criterion.CodeDataManager.getCodeDetailRecord(
                'id',
                model.get(ref.name),
                ref.getCodeDataId()
            );

            return record ? this.makeValue(record) : null;
        },

        makeValue : function(record) {
            return record.get(this.dataProperty);
        }
    };

});
