Ext.define('criterion.store.employer.recruiting.Settings', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_recruiting_settings',

        model : 'criterion.model.employer.recruiting.Setting',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_RECRUITING_SETTINGS
        }
    };
});
