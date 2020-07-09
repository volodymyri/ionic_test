Ext.define('criterion.store.assignment.Additional', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_assignment_additional',

        model : 'criterion.model.assignment.Additional',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.ASSIGNMENT_ADDITIONAL,

            api: {
                read: API.ASSIGNMENT_ADDITIONAL,
                create: API.ASSIGNMENT,
                update: API.ASSIGNMENT,
                destroy: API.ASSIGNMENT
            }
        }
    }
});
