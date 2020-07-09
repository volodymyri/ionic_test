Ext.define('criterion.store.employer.shiftRate.Details', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_shift_rate_details',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        model : 'criterion.model.employer.shiftRate.Detail',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_RATE_DETAIL
        },

        autoSync : false
    };
});
