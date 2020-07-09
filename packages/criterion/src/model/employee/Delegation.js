Ext.define('criterion.model.employee.Delegation', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_DELEGATION
        },

        fields : [
            {
                name : 'delegatedByEmployeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'delegatedToEmployeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'delegatedToEmployeeName',
                type : 'string',
                persist : false
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
