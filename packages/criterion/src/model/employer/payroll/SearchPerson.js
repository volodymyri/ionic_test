Ext.define('criterion.model.employer.payroll.SearchPerson', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_search_person',

        model : 'criterion.model.Person', // todo - tmp. Need special model. API is not available now.
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_SEARCH_PERSON
        }
    };
});
