Ext.define('criterion.store.learning.EmployeeByCourse', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_employee_by_course',

        model : 'criterion.model.learning.EmployeeByCourse',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_EMPLOYEE_BY_COURSE
        }
    };
});
