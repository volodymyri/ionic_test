Ext.define('criterion.model.EmployeeGroup', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'employeeCount',
                type : 'integer'
            },
            {
                name : 'canPost', // used in criterion.view.settings.employeeEngagement.CommunityEmployeeGroup
                type : 'boolean',
                persist : false
            },
            {
                name : 'isDynamic',
                type : 'boolean'
            },
            {
                name : 'formula',
                type : 'string'
            },
            {
                name : 'includeTerminated',
                type : 'boolean'
            },
            {
                name : 'includeFuture',
                type : 'boolean'
            },
            {
                name : 'includeUnapproved',
                type : 'boolean'
            },
            {
                name : 'isDailyRecalculated',
                type : 'boolean'
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'nameWithEmployer',
                calculate : function(data) {
                    let employerName = data.employerName;

                    return Ext.String.format(employerName ? '{0} [{1}]' : '{0}', data.name, employerName);
                }
            }
        ]
    };
});

