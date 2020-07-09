Ext.define('criterion.store.learning.Complete', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_complete',

        model : 'criterion.model.learning.Complete',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COMPLETE
        }
    };
});
