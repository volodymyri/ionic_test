Ext.define('criterion.model.assignment.Additional', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.ASSIGNMENT_ADDITIONAL
        },

        fields : [
            {
                name : 'assignmentId',
                type : 'int'
            },
            {
                name : 'assignmentDetailTitle',
                type : 'string'
            },
            {
                name : 'positionTitle',
                type : 'string'
            },
            {
                name : 'employmentStatus',
                type : 'string'
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };
});