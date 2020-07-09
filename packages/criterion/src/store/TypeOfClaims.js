Ext.define('criterion.store.TypeOfClaims', function() {

    return {
        alias : 'store.criterion_type_of_claims',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.TypeOfClaim',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TYPE_OF_CLAIM
        }
    };
});
