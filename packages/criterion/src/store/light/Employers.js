Ext.define('criterion.store.light.Employers', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employers_light',

        model : 'criterion.model.light.Employer',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER
        }
    };
});
