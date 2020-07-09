Ext.define('criterion.model.payroll.AssignmentAvailable', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PAYROLL_ASSIGNMENT_AVAILABLE
        },

        fields : [
            {
                name : 'assignmentId',
                type : 'integer'
            },
            {
                name : 'assignmentDetailId',
                type : 'integer'
            },
            {
                name : 'title',
                type : 'string'
            }
        ]
    };
});
