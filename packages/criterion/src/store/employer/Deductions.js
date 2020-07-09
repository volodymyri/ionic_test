Ext.define('criterion.store.employer.Deductions', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.Deduction',
        alias : 'store.employer_deductions',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_DEDUCTION
        }
    };
});
