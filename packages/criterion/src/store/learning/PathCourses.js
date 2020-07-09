Ext.define('criterion.store.learning.PathCourses', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_learning_path_courses',

        model : 'criterion.model.learning.PathCourse',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_LEARNING_PATH_COURSE
        }

    };
});
