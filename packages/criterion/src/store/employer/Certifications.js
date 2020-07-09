Ext.define('criterion.store.employer.Certifications', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_certifications',

        model : 'criterion.model.employer.Certification',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_CERTIFICATION
        }
    };
});
