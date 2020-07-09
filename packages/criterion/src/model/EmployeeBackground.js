Ext.define('criterion.model.EmployeeBackground', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BACKGROUND
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
                name : 'statusCd',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'statusName',
                type : 'string'
            },
            {
                name : 'vendorCd',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'vendorName',
                type : 'string'
            },
            {
                name : 'orderDate',
                type : 'date',
                dateFormat : API.DATE_FORMAT
            },
            {
                name : 'reference',
                type : 'string'
            },
            {
                name : 'reportDate',
                type : 'date',
                dateFormat : API.DATE_FORMAT
            },
            {
                name : 'reportDocumentId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
