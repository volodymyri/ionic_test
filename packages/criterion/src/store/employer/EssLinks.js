Ext.define('criterion.store.employer.EssLinks', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_ess_links',

        model : 'criterion.model.employer.EssLink',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ESS_LINK
        }
    };

});
