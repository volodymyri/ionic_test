Ext.define('criterion.store.employer.CompanyEvents', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_company_events',

        model : 'criterion.model.employer.CompanyEvent',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COMPANY_EVENT
        },

        autoSync : false

    };
});
