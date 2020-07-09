Ext.define('criterion.store.NatureOfClaims', function() {

    return {
        alias : 'store.criterion_nature_of_claims',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.NatureOfClaim',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.NATURE_OF_CLAIM
        }
    };
});
