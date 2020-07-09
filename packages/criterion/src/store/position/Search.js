Ext.define('criterion.store.position.Search', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',
        alias : 'store.position_search',

        model : 'criterion.model.Position',

        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_SEARCH,
            api : {
                create : API.EMPLOYER_POSITION,
                read : API.EMPLOYER_POSITION_SEARCH,
                update : API.EMPLOYER_POSITION,
                destroy : API.EMPLOYER_POSITION
            }
        }
    };
});
