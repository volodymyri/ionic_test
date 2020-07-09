Ext.define('criterion.store.assignment.Details', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_assignment_details',

        model : 'criterion.model.assignment.Detail',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
