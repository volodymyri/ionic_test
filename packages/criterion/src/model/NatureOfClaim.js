Ext.define('criterion.model.NatureOfClaim', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.NATURE_OF_CLAIM
        },

        fields : [
            {
                name : 'typeOfClaimId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            }
        ]
    };
});
