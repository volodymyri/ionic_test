Ext.define('criterion.model.employee.Search', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Employee',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_SEARCH
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                persist : false,

                convert : function(newValue, model) {
                    var ids = model.get('id') && model.get('id').toString().split('-');

                    return ids && ids.length > 1 && parseInt(ids[1]);
                }
            },
            {
                name : 'personId',
                type : 'int',
                persist : false,

                convert : function(newValue, model) {
                    var ids = model.get('id') && model.get('id').toString().split('-');

                    return ids && ids.length && parseInt(ids[0]);
                }
            },
            {
                name : 'fullName',
                persist: false,
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
                name : 'positionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_TYPE
            },
            {
                name : 'positionTitle',
                type : 'string',
                persist : false
            },
            {
                name : 'lastName',
                type : 'string',
                persist : false
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
                name : 'nickName',
                type : 'string'
            },
            {
                name : 'employerAlternativeName',
                type : 'string'
            },
            {
                name : 'nationalIdentifier',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'hireDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };

});
