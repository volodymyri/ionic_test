Ext.define('criterion.store.person.EmploymentHistory', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_person_employment_history',

        model : 'criterion.model.person.EmploymentHistory',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_EMPLOYMENT_HISTORY
        }
    };
});
