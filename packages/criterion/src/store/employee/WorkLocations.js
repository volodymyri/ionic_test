Ext.define('criterion.store.employee.WorkLocations', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_work_locations',

        model : 'criterion.model.employee.WorkLocation',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_WORK_LOCATION
        }
    };

});
