Ext.define('criterion.store.candidate.Backgrounds', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_backgrounds',

        model : 'criterion.model.candidate.Background',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_BACKGROUND
        }
    };
});
