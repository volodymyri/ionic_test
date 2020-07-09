Ext.define('criterion.store.Skills', function() {
    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_skills',

        model : 'criterion.model.Skill',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SKILL
        }
    };
});
