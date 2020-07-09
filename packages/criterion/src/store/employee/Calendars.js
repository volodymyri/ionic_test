Ext.define('criterion.store.employee.Calendars', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_calendars',
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employee.Calendar',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_CALENDAR
        }
    };

});
