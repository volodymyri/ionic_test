Ext.define('criterion.store.position.WithJob', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        requires : [
            'criterion.model.position.WithJob',
            'criterion.data.proxy.Rest'
        ],

        model : 'criterion.model.position.WithJob',

        autoLoad : false,
        remoteFilter : true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_WITH_JOB
        }
    };
});
