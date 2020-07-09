Ext.define('criterion.store.employer.payroll.Years', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_years',

        model : 'criterion.model.employer.payroll.Year',

        autoLoad : false,

        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PAYROLL_YEARS
        },

        sorters : [
            {
                property : 'year',
                direction : 'DESC'
            }
        ]
    };
});
