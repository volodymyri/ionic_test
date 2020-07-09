Ext.define('criterion.store.employer.HolidayDetails', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_holiday_details',

        model : 'criterion.model.employer.HolidayDetail',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_HOLIDAY_DETAIL
        }
    };
});
