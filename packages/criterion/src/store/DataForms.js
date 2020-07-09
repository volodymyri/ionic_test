Ext.define('criterion.store.DataForms', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_data_forms',

        model : 'criterion.model.DataForm',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.DATAFORM
        }
    };
});
