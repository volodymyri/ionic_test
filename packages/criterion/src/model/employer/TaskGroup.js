Ext.define('criterion.model.employer.TaskGroup', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.TaskGroupDetail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TASK_GROUP
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
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.TaskGroupDetail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
