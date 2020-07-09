Ext.define('criterion.model.workLocation.Task', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORK_LOCATION_TASK
        },

        fields : [
            {
                name : 'workLocationAreaId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taskId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taskName',
                type : 'string',
                persist : false
            },
            {
                name : 'workLocationAreaName',
                type : 'string',
                persist : false
            }
        ]
    };
});
