Ext.define('criterion.store.employer.position.Skills', function() {
    return {
        extend : 'criterion.data.Store',

        alias : 'store.employer_position_skills',

        model : 'criterion.model.employer.position.Skill',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
