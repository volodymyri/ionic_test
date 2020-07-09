Ext.define('criterion.model.security.RoleGroup', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.SECURITY_ROLE_GROUP
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeGroupId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});