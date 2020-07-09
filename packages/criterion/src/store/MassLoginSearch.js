Ext.define('criterion.store.MassLoginSearch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_mass_login_search',

        model : 'criterion.model.MassLoginSearch',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.MASS_LOGIN_SEARCH
        }
    };
});
