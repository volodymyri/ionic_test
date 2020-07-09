Ext.define('criterion.store.employer.Onboardings', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_onboardings',

        model : 'criterion.model.employer.Onboarding',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_ONBOARDING
        }
    };
});
