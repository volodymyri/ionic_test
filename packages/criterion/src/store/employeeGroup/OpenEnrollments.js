Ext.define('criterion.store.employeeGroup.OpenEnrollments', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_open_enrollments',

        model : 'criterion.model.employeeGroup.OpenEnrollment',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_OPEN_ENROLLMENT
        }
    };
});
