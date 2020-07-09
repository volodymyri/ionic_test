Ext.define('criterion.store.learning.CourseSearch', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',
        alias : 'store.criterion_learning_course_search',

        model : 'criterion.model.employer.Course',

        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE
        }
    };
});
