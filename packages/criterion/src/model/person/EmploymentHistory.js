Ext.define('criterion.model.person.EmploymentHistory', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_EMPLOYMENT_HISTORY
        },

        fields : [
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'employerName',
                type : 'string'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };
});
