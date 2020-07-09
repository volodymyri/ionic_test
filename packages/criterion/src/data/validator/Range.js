/**
 * Extension for range validator that allows to exclude border values out of valid values.
 */
Ext.define('criterion.data.validator.Range', function() {

    return {
        alternateClassName : [
            'criterion.data.validator.Range'
        ],

        extend : 'Ext.data.validator.Range',

        alias : 'data.validator.criterion_range',

        type : 'criterion_range',

        config : {

            /**
             * @cfg {Boolean} field
             * Exclude max value.
             */
            excludeMax : false,

            /**
             * @cfg {String} field
             * Exclude max value validation message.
             */
            excludeMaxMessage : undefined,

            /**
             * @cfg {Boolean} field
             * Exclude min value.
             */
            excludeMin : false,

            /**
             * @cfg {String} field
             * Exclude min value validation message.
             */
            excludeMinMessage : undefined

        },

        validate : function(value, record) {
            var me = this,
                maxExcludeMessage = me.getExcludeMaxMessage(),
                minExcludeMessage = me.getExcludeMinMessage();

            var baseResult = this.callParent(arguments);

            if (baseResult !== true) {
                return baseResult;
            } else if (!me.getExcludeMax() && !me.getExcludeMin()) {
                return baseResult;
            }

            if (me.getExcludeMax() && me.getMax() == value) {
                return maxExcludeMessage ? maxExcludeMessage : false;
            }

            if (me.getExcludeMin() && me.getMin() == value) {
                return minExcludeMessage ? minExcludeMessage : false;
            }

            return baseResult;
        }
    }
});
