Ext.define('criterion.store.Assignments', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_assignments',

        model : 'criterion.model.Assignment',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
