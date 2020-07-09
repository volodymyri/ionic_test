/**
 * Base abstract superclass for a validator that checks value of field using another field.
 * For example if one field should be less of another one.
 */
Ext.define('criterion.data.validator.Relation', function() {

    return {
        alternateClassName : [
            'criterion.data.validator.Relation'
        ],

        extend : 'Ext.data.validator.Validator',

        alias : 'data.validator.criterion_relation',

        type : 'criterion_relation',

        config : {

            /**
             * @cfg {String} field
             * The field.
             */
            field : undefined,

            /**
             * @cfg {String} field
             * The name of field.
             */
            fieldName : undefined,

            /**
             * @cfg {String} message
             * The error message to return when the value is invalid.
             */
            message : '',

            /**
             * Comparision function can be passed via config as well.
             * Should return 'true' if value is valid.
             * @type {Function}
             */
            relationFn : null
        },


        constructor : function() {
            var me = this;

            me.callParent(arguments);

            if (!me.getField()) {
                Ext.Error.raise('Field must be specified');
            }
        },


        relation : function(value, fieldValue) {
            return this.getRelationFn() ? this.getRelationFn().apply(this, arguments) : true;
        },


        validate : function(value, record) {
            var me = this,
                msg = true;

            if (!record) { // bug in ext
                Ext.log({
                    level: 'warn',
                    msg: 'Validation of value "' + value + '" cannot be performed, no record passed.'
                });
                return true
            }

            if (!this.relation(value, record.get(this.getField()))) {
                msg = Ext.String.format(me.getMessage(), me.getFieldName() || me.getField());
            }

            return msg;
        }
    }
});
