// @deprecated
Ext.define('criterion.store.employer.shift.Certifications', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.shift.Certification',
        alias : 'store.criterion_employer_shift_certifications',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_CERTIFICATION
        }
    };
});

