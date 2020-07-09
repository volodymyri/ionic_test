Ext.define('criterion.store.FieldFormatTypes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_field_types',

        model : 'criterion.model.FieldFormatType',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.FIELD_FORMAT_TYPE
        }
    };
});
