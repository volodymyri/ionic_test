Ext.define('criterion.store.employer.WorkLocations', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias: 'store.employer_work_locations',

        model : 'criterion.model.employer.WorkLocation',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_WORK_LOCATION
        }
    };

});
