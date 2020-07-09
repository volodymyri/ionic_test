Ext.define('criterion.store.candidate.Educations', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_educations',

        model : 'criterion.model.candidate.Education',
        autoLoad : false,
        autoSync : false,
        batchActions : true,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_EDUCATION
        }
    };
});
