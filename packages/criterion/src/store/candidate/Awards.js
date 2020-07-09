Ext.define('criterion.store.candidate.Awards', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_awards',

        model : 'criterion.model.candidate.Award',
        autoLoad : false,
        autoSync : false,
        batchActions : true,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_AWARD
        }
    };
});
