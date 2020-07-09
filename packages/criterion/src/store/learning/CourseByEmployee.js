Ext.define('criterion.store.learning.CourseByEmployee', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_course_by_employee',

        model : 'criterion.model.learning.CourseByEmployee',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_BY_EMPLOYEE
        }
    };
});
