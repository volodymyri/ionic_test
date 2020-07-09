Ext.define('criterion.store.employee.attendance.Overtime', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employee_attendance_overtime',

        model : 'criterion.model.employee.attendance.Overtime',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_ATTENDANCE_OVERTIME
        }
    };

});
