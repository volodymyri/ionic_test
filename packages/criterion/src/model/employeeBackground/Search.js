Ext.define('criterion.model.employeeBackground.Search', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();
    return {
        extend : 'criterion.model.Abstract',

        idProperty : 'employeeId',

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'fullName',
                persist : false,
                calculate : function(data) {
                    var middleName = data.middleName;

                    return data.firstName + ' ' + (middleName && middleName + ' ') + data.lastName;
                }
            },
            {
                name : 'employeeName',
                persist : false,
                calculate : function(data) {
                    return data.firstName + ' ' + data.lastName;
                }
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
                name : 'middleName',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'lastReportOrderDate',
                type : 'date',
                dateFormat : API.DATE_FORMAT
            }
        ]
    };

});
