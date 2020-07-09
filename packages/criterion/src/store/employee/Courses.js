Ext.define('criterion.store.employee.Courses', function() {

    var API = criterion.consts.Api.API;

    return {
        alternateClassName : [
            'criterion.store.employee.Courses'
        ],

        alias : 'store.criterion_employee_courses',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.Course',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_COURSE
        }
    };
});
