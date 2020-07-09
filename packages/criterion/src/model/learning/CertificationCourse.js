Ext.define('criterion.model.learning.CertificationCourse', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'courseId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'certificationId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_CERTIFICATION_COURSE
        }
    };
});
