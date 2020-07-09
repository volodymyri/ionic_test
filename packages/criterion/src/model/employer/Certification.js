Ext.define('criterion.model.employer.Certification', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'issuedBy',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'minCoursesRequired',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'validityPeriod',
                type : 'integer',
                allowNull : true
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_CERTIFICATION
        }
    };
});