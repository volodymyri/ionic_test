Ext.define('criterion.store.workflow.Transactions', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_workflow_transactions',

        model : 'criterion.model.workflow.Transaction',
        autoLoad : false,
        autoSync : false,
        remoteSort : true,
        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,

        sorters : [{
            property : 'date',
            direction : 'DESC'
        }],

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_TRANSACTION,
            implicitIncludes : false
        }
    };
});
