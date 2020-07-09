// @deprecated
Ext.define('criterion.store.employer.shift.Skills', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.shift.Skill',
        alias : 'store.criterion_employer_shift_skills',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_SKILL
        }
    };
});

