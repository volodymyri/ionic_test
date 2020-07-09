Ext.define('criterion.store.employee.UnavailableBlocks', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_unavailable_blocks',

        model : 'criterion.model.employee.UnavailableBlock',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_UNAVAILABLE_BLOCK
        }
    };

});
