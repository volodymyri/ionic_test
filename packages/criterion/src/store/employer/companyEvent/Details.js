Ext.define('criterion.store.employer.companyEvent.Details', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_company_event_details',

        model : 'criterion.model.employer.companyEvent.Detail',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COMPANY_EVENT_DETAIL
        },

        autoSync : false

    };
});
