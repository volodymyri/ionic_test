Ext.define('criterion.model.review.Reviewer', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_REVIEWER
        },

        fields : [
            {
                name : 'reviewId',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeName',
                type : 'string',
                persist : false
            },
            {
                name : 'reviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'nextReviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            }
        ]
    };
});
