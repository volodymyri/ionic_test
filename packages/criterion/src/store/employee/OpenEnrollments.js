Ext.define('criterion.store.employee.OpenEnrollments', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_open_enrollments',

        model : 'criterion.model.employee.OpenEnrollment',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
