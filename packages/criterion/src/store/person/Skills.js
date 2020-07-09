Ext.define('criterion.store.person.Skills', function() {

    return {
        alias : 'store.criterion_person_skills',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.person.Skill',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PERSON_SKILL
        }
    };

});
