Ext.define('criterion.model.employer.Carrier', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_CARRIER
        },

        fields : [
            {
                name : 'taxId',
                type : 'string'
            },
            {
                name : 'tradingPartnerId',
                type : 'string'
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
                name : 'masterPolicyNumber',
                type : 'string'
            }
        ]
    };
});