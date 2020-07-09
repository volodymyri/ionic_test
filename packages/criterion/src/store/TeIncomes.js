Ext.define('criterion.store.TeIncomes', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_te_incomes',

        model : 'criterion.model.TeIncome',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TE_INCOME
        }
    };
});
