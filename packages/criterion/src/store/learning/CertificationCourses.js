Ext.define('criterion.store.learning.CertificationCourses', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_certification_courses',

        model : 'criterion.model.learning.CertificationCourse',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_CERTIFICATION_COURSE
        },

        autoSync : false
    };
});
