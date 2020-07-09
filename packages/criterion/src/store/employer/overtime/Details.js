Ext.define('criterion.store.employer.overtime.Details', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_overtime_details',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        model : 'criterion.model.employer.overtime.Detail',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OVERTIME_DETAIL
        },

        autoSync : false
    };
});
