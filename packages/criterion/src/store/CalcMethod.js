Ext.define('criterion.store.CalcMethod', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias: 'store.criterion_calc_method',

        model : 'criterion.model.CalcMethod',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.CALC_METHOD
        }
    };
});
