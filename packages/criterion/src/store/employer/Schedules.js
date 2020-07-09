Ext.define('criterion.store.employer.Schedules', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.Schedule',
        alias : 'store.criterion_employer_schedules',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SCHEDULE
        }
    };
});
