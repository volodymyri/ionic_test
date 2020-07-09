Ext.define('criterion.data.field.TimeZone', function() {
    
    return {
        alias : 'data.field.criterion_timezone',

        extend : 'criterion.data.field.CodeData',

        requires : [],

        codeDataId : criterion.consts.Dict.TIME_ZONE,

        defaultValue : null,
        persist : false,

        handleDataChanged : function() {
            var defaultRecord = this.getStore().findRecord('code', criterion.Utils.getCurrentTimezoneCode());
            this.defaultValue = defaultRecord ? defaultRecord.getId() : null
        }
    };

});
