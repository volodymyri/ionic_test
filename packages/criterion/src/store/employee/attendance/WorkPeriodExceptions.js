Ext.define('criterion.store.employee.attendance.WorkPeriodExceptions', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_attendance_work_period_exceptions',

        model : 'criterion.model.employee.attendance.WorkPeriodException',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ATTENDANCE_WORK_PERIOD_EXCEPTION
        }
    };

});
