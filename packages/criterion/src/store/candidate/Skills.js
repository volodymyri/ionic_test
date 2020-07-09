Ext.define('criterion.store.candidate.Skills', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_skills',

        model : 'criterion.model.candidate.Skill',
        autoLoad : false,
        autoSync : false,
        batchActions : true,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_SKILL
        }
    };
});
