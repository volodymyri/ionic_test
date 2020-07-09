Ext.define('criterion.store.learning.CourseClassForEnroll', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_course_class_for_enroll',

        model : 'criterion.model.learning.CourseClassForEnroll',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_CLASS_FOR_ENROLL
        }
    };
});
