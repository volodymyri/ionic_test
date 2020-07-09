Ext.define('criterion.model.employee.ReviewList', function() {

    return {

        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.reviewTemplate.Period'
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_REVIEW_LIST
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'employeeReviewId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'reviewedEmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'reviewPeriodName',
                type : 'string',
                persist : false
            },
            {
                name : 'periodStart',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'periodEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewScaleId',
                type : 'integer'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.reviewTemplate.Period',
                name : 'reviewPeriod',
                associationKey : 'reviewPeriod'
            }
        ]
    };
});
