Ext.define('criterion.store.DeductionFrequencies', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_deduction_frequencies',

        model : 'criterion.model.DeductionFrequency',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.DEDUCTION_FREQUENCY
        }
    };
});
