Ext.define('criterion.store.workflow.Steps', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_workflow_steps',

        model : 'criterion.model.workflow.Step',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_TRANSACTION_STEPS
        }
    };
});
