Ext.define('criterion.model.employee.ReviewDetail', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_REVIEW_DETAIL
        },

        fields : [
            {
                name : 'employeeReviewId',
                type : 'int',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'reviewCompetencyId',
                type : 'int',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'reviewScaleDetailId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'rating',
                type : 'float',
                allowNull : true
            },
            {
                name : 'reviewComments',
                type : 'string'
            }
        ]
    };
});
