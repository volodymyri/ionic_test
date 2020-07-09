Ext.define('criterion.store.employer.RequiredCoverages', function() {

    return {
        alias : 'store.criterion_employer_required_coverages',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.RequiredCoverage',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_REQUIRED_COVERAGE
        }
    };
});
