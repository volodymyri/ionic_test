Ext.define('criterion.overrides.form.field.Time', {

    override : 'Ext.form.field.Time',

    showNextMidnight : false,
    sortByDisplayField : false,

    initComponent : function() {
        var me = this,
            min = me.minValue,
            max = me.maxValue;

        if (min) {
            me.setMinValue(min);
        }
        if (max) {
            me.setMaxValue(max);
        }
        me.displayTpl = new Ext.XTemplate(
            '<tpl for=".">' +
            '{[typeof values === "string" ? values : this.formatDate(values["' + me.displayField + '"])]}' +
            '<tpl if="xindex < xcount">' + me.delimiter + '</tpl>' +
            '</tpl>', {
                formatDate : me.formatDate.bind(me)
            });

        // Create a store of times.
        me.store = Ext.picker.Time.createStore(me.format, me.increment, me.showNextMidnight);

        me.superclass.initComponent.apply(me, arguments);

        // Ensure time constraints are applied to the store.
        // TimePicker does this on create.
        me.getPicker();
    },

    setValue : function(v) {
        var me = this;

        // The timefield can get in a loop when creating its picker. For instance, when creating the picker, the
        // timepicker will add a filter (see TimePicker#updateList) which will then trigger the checkValueOnChange
        // listener which in turn calls into here, rinse and repeat.
        if (me.creatingPicker) {
            return;
        }

        // Store MUST be created for parent setValue to function.
        me.getPicker();

        if (Ext.isDate(v)) {
            v = !me.showNextMidnight && me.getInitDate(v.getHours(), v.getMinutes(), v.getSeconds()) || new Date(v);
        }

        return me.superclass.setValue.apply(me, [v]);
    }
});
