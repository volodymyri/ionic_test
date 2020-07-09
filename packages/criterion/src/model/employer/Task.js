Ext.define('criterion.model.employer.Task', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TASK
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'projectId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'projectName',
                type : 'string',
                persist : false
            },
            {
                name : 'code',
                type : 'string',
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
                name : 'values'
            }
        ]
    };
});
