Ext.define('criterion.data.field.LocalizationString', function() {

    const EN = criterion.Consts.LOCALIZATION_LANGUAGE_EN;

    return {
        alias : 'data.field.criterion_localization_string',

        extend : 'Ext.data.field.String',

        convert : function(value) {
            let def = {};

            def[EN] = value;

            return Ext.isString(value) && value[0] === '{' ? Ext.decode(value, true) : def;
        },

        serialize : function(value) {
            let valKeys = Ext.isObject(value) ? Ext.Object.getKeys(value) : [];

            return valKeys.length > 1 ? Ext.encode(value) : (Ext.isObject(value) && value[EN] ? value[EN] : value);
        }
    };

});
