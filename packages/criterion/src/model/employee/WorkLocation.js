Ext.define('criterion.model.employee.WorkLocation', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'employerLocationName',
                persist : false,
                type : 'string'
            },
            {
                name : 'workLocationId',
                type : 'integer',
                persist : false
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_WORK_LOCATION
        }
    };

});
