Ext.define('criterion.model.employer.TaskClassification', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TASK_CLASSIFICATION
        },

        fields : [
            {
                name : 'taskId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'classificationId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'selectedValueId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
