Ext.define('criterion.model.employee.SearchDelegation', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_SEARCH_DELEGATION
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'personId',
                type : 'int'
            },
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'employeeName',
                calculate : function(data) {
                    return data.firstName + ' ' + data.lastName;
                }
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'hireDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'positionTitle',
                type : 'string'
            }
        ]
    };

});
