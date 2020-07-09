Ext.define('criterion.store.employer.TaskClassifications', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employer_task_classifications',

        model : 'criterion.model.employer.TaskClassification',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_TASK_CLASSIFICATION
        }
    };
});
