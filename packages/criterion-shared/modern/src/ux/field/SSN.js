Ext.define('criterion.ux.field.SSN', function() {

    return {

        alias : 'widget.criterion_field_ssn',

        extend : 'Ext.field.Text',

        classCls : 'criterion-field-ssn',
        hiddenStateCls : 'criterion-hidden-value-hidden-state',

        triggers : {
            hide : {
                cls : 'hide-value-trigger',
                weight : -1,
                disableOnReadOnly : false,
                handler : 'onHideTrigger',
                scope : 'this'
            }
        },

        onHideTrigger : function() {
            this[this.hiddenValue ? 'removeCls' : 'addCls'](this.hiddenStateCls);
            this.hiddenValue = !this.hiddenValue;
        },

        constructor : function() {
            this.callParent(arguments);
            this.hiddenValue = true;
            this.addCls(this.hiddenStateCls);
        }
    };

});
