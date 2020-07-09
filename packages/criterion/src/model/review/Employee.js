Ext.define('criterion.model.review.Employee', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_EMPLOYEE
        },

        fields : [
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'middleName',
                type : 'string'
            },
            {
                name : 'employerName',
                type : 'string'
            },
            {
                name : 'positionTitle',
                type : 'string'
            }
        ]
    };
});
