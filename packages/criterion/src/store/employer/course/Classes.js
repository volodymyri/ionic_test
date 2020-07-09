Ext.define('criterion.store.employer.course.Classes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_course_classes',

        model : 'criterion.model.employer.course.Class',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE_CLASS
        }
    };
});
