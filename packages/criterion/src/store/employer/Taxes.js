Ext.define('criterion.store.employer.Taxes', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_taxes',

        model : 'criterion.model.employer.Tax',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_TAX
        }
    };
});
