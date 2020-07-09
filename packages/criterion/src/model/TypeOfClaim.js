Ext.define('criterion.model.TypeOfClaim', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.TYPE_OF_CLAIM
        },

        fields : [
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
