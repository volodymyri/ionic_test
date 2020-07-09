Ext.define('criterion.model.employee.compensation.claim.Cost', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.compensation.claim.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKER_COMPENSATION_CLAIM_COST
        },

        fields : [
            {
                name : 'wcClaimId',
                type : 'integer'
            },
            {
                name : 'description',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'cost',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
