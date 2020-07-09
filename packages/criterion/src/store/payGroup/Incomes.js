Ext.define('criterion.store.payGroup.Incomes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_pay_group_incomes',

        model : 'criterion.model.payGroup.Income',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PAY_GROUP_INCOME
        }
    };
});
