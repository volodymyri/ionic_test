Ext.define('criterion.model.employer.payrollBatch.AvailableEmployee', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Employee',

        requires : [
            'criterion.model.Person'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_AVAILABLE_EMPLOYEES
        },

        fields : [
            {
                name: 'annualSalary',
                type: 'float'
            },
            {
                name : 'lastName',
                type : 'string',
                persist : false,
                mapping : function(data) {
                    return data.person && data.person.lastName;
                }
            },
            {
                name : 'firstName',
                type : 'string',
                persist : false,
                mapping : function(data) {
                    return data.person && data.person.firstName;
                }
            },
            {
                name : 'middleName',
                type : 'string',
                persist : false,
                mapping : function(data) {
                    return data.person && data.person.middleName;
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Person',
                name : 'person',
                associationKey : 'person'
            }
        ]
    };

});
