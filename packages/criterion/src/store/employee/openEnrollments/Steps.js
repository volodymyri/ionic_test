Ext.define('criterion.store.employee.openEnrollment.Steps', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_open_enrollment_steps',

        model : 'criterion.model.employee.openEnrollment.Step',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
