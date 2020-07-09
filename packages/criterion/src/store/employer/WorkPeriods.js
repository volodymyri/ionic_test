Ext.define('criterion.store.employer.WorkPeriods', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias: 'store.criterion_employer_work_periods',

        model : 'criterion.model.employer.WorkPeriod',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_WORK_PERIOD
        }
    };

});
