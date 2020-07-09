Ext.define('criterion.store.EssHelp', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_ess_help',

        model : 'criterion.model.EssHelp',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ESS_HELP
        }
    };
});
