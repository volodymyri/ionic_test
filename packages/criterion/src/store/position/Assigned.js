Ext.define('criterion.store.position.Assigned', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        requires : [ 'criterion.data.proxy.Rest' ],

        model : 'criterion.model.position.Assigned',

        autoLoad : false,
        remoteFilter : true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_ASSIGNED
        }
    };
});
