Ext.define('criterion.store.employer.Holidays', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_holidays',

        model : 'criterion.model.employer.Holiday',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_HOLIDAY
        }
    };
});
