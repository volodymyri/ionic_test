Ext.define('criterion.store.learning.EmployeeByCourseClass', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_employee_by_course_class',

        model : 'criterion.model.learning.EmployeeByCourse',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_EMPLOYEE_BY_COURSE_CLASS
        }
    };
});
