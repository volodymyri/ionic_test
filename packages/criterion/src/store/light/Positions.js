Ext.define('criterion.store.light.Positions', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.positions_light',

        model : 'criterion.model.light.Position',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION
        }
    };
});
