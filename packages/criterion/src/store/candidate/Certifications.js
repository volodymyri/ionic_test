Ext.define('criterion.store.candidate.Certifications', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_certifications',

        model : 'criterion.model.candidate.Certification',
        autoLoad : false,
        autoSync : false,
        batchActions : true,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_CERTIFICATION
        }
    };
});
