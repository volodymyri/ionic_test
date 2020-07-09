Ext.define('criterion.store.employer.Projects', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employer_projects',

        model : 'criterion.model.employer.Project',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_PROJECT
        }
    };
});
