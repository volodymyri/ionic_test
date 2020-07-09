Ext.define('criterion.model.employee.compensation.claim.Log', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.compensation.claim.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKER_COMPENSATION_CLAIM_LOG
        },

        fields : [
            {
                name : 'activityDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'notes',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            }
        ]
    };
});
