Ext.define('criterion.store.employer.Carriers', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employer_carriers',

        model : 'criterion.model.employer.Carrier',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_CARRIER
        }
    };
});
