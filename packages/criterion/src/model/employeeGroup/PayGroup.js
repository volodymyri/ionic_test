Ext.define('criterion.model.employeeGroup.PayGroup', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_PAY_GROUP
        },

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
