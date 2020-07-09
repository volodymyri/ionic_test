Ext.define('criterion.store.employer.IncomeLists', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias: 'store.employer_income_lists',

        model : 'criterion.model.employer.IncomeList',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_INCOME_LIST
        }
    };

});
