Ext.define('criterion.model.employeeGroup.Member', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.Employee',
            'criterion.model.EmployeeGroup',
            'criterion.model.Person'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_MEMBER
        },

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isInProcess',
                type : 'boolean',
                persist : false
            },
            {
                name : 'lastName',
                type : 'string',
                persist : false,
                convert : function(value, record) {
                    var person = record.data && record.data.person;
                    return person ? person['lastName'] : '';
                }
            },
            {
                name : 'firstName',
                type : 'string',
                persist : false,
                convert : function(value, record) {
                    var person = record.data && record.data.person;
                    return person ? person['firstName'] : '';
                }
            },
            {
                name : 'middleName',
                type : 'string',
                persist : false,
                convert : function(value, record) {
                    var person = record.data && record.data.person;
                    return person ? person['middleName'] : '';
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Employee',
                name : 'employee',
                associationKey : 'employee'
            },
            {
                model : 'criterion.model.EmployeeGroup',
                name : 'employeeGroup',
                associationKey : 'employeeGroup'
            },
            {
                model : 'criterion.model.Person',
                name : 'person',
                associationKey : 'person'
            }
        ]
    };
});
