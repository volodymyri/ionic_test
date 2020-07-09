Ext.define('criterion.store.employer.benefit.Types', function() {

    return {
        extend : 'criterion.data.Store',

        alias: 'store.criterion_employer_benefit_types',

        model : 'criterion.model.employer.benefit.Type',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_BENEFIT_TYPE
        }
    };
});
