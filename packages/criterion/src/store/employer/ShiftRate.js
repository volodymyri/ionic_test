Ext.define('criterion.store.employer.ShiftRates', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.ShiftRate',
        alias : 'store.employer_shift_rates',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_RATE
        }
    };
});
