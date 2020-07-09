Ext.define('criterion.store.employer.Tasks', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employer_tasks',

        model : 'criterion.model.employer.Task',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_TASK
        }
    };
});
