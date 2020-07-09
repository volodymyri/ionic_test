Ext.define('criterion.store.acumatica.Branches', function() {

    return {
        alias : 'store.criterion_acumatica_branches',

        extend : 'criterion.data.Store',

        model : 'criterion.model.acumatica.Branch',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ACUMATICA_BRANCH
        }
    };
});
