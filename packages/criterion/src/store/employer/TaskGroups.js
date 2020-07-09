Ext.define('criterion.store.employer.TaskGroups', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employer_task_groups',

        model : 'criterion.model.employer.TaskGroup',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_TASK_GROUP
        }
    };
});
