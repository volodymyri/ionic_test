Ext.define('criterion.model.employeeGroup.ByMember', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_BY_MEMBER
        },

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'isDynamic',
                type : 'boolean',
                persist : false
            }
        ]
    };
});
