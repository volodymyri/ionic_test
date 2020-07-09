Ext.define('criterion.store.employee.SubordinatesTime', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_subordinates_time',

        model : 'criterion.model.employee.SubordinateTime',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_SUBORDINATE_TIME
        }
    };

});
