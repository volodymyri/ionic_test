Ext.define('criterion.store.customField.Values', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_customdata_values',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.customField.Value',

        proxy : {
            type : 'criterion_rest',
            url : API.CUSTOM_VALUE
        },

        autoSync : false,

        setEntityId : function(entityId) {
            this.each(function(record) {
                record.set('entityId', entityId);
            });
        }
    }

});
