Ext.define('criterion.model.employer.project.Task', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'projectId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taskId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string',
                persist : false
            },
            {
                name : 'name',
                type : 'string',
                persist : false
            },
            {
                name : 'description',
                type : 'string',
                persist : false
            }
        ]
    };
});
