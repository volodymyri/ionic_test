Ext.define('criterion.model.employeeGroup.LearningPath', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_LEARNING_PATH
        },

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'learningPathId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
