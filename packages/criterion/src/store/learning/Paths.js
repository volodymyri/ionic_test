Ext.define('criterion.store.learning.Paths', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_learning_paths',

        model : 'criterion.model.learning.Path',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_LEARNING_PATH
        }
    };
});

