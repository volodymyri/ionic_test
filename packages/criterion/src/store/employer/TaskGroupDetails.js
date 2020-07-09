Ext.define('criterion.store.employer.TaskGroupDetails', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employer_task_group_details',

        model : 'criterion.model.employer.TaskGroupDetail',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_TASK_GROUP
        }
    };
});
