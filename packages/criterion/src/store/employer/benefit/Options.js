Ext.define('criterion.store.employer.benefit.Options', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.benefit.Option',
        alias : 'store.employer_benefit_options',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_OPTION
        }
    };
});
