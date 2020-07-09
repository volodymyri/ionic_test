Ext.define('criterion.store.payroll.AvailableProjects', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_payroll_available_projects',

        model : 'criterion.model.employer.Project',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL_AVAILABLE_PROJECTS
        }
    };
});
