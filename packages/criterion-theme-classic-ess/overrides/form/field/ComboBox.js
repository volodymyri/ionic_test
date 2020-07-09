Ext.define('criterion.theme.classic.ess.overrides.form.field.ComboBox', {

    override : 'Ext.form.field.ComboBox',

    pickerOffset : [5, 5],

    defaultListConfig: {
        loadingHeight: 70,
        minWidth: 70,
        maxHeight: 300,
        shadow: 'frame',
        shadowOffset: 200
    },

    createPicker : function() {
        var me = this,
            picker = this.callParent(arguments);

        if (me.matchFieldWidth && me.pickerOffset) {
            picker.setWidth = function(width) {
                picker.superclass.setWidth.apply(picker, [width - me.pickerOffset[0] * 2]);
            };
        }

        return picker;
    }
});