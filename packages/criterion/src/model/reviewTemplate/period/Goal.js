Ext.define('criterion.model.reviewTemplate.period.Goal', function() {

    return {

        extend : 'criterion.model.employee.Goal',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REVIEW_TEMPLATE_PERIOD_GOAL
        },

        fields : [
            {
                name : 'fullName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerId',
                type : 'integer'
            }
        ]
    };
});
