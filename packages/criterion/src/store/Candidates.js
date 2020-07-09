Ext.define('criterion.store.Candidates', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_candidates',

        model : 'criterion.model.Candidate',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE
        }
    };
});
