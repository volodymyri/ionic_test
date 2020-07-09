Ext.define('criterion.store.workLocation.Tasks', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.work_location_tasks',

        model : 'criterion.model.workLocation.Task',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.WORK_LOCATION_TASK
        }
    };
});

