Ext.define('criterion.store.candidate.Experiences', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_experiences',

        model : 'criterion.model.candidate.Experience',
        autoLoad : false,
        autoSync : false,
        batchActions : true,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_EXPERIENCE
        }
    };
});
