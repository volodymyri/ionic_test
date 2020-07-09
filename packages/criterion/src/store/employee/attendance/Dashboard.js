Ext.define('criterion.store.employee.attendance.Dashboard', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employee_attendance_dashboard',

        model : 'criterion.model.employee.attendance.Dashboard',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_ATTENDANCE_DASHBOARD
        }
    };

});
