Ext.define('criterion.store.TeDeductions', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_te_deductions',

        model : 'criterion.model.TeDeduction',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TE_DEDUCTION
        }
    };
});
