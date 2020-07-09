Ext.define('criterion.store.learning.EmployeeGroupCourses', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_learning_employee_group_courses',

        model : 'criterion.model.learning.EmployeeGroupCourse',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_COURSE
        }
    }
});
