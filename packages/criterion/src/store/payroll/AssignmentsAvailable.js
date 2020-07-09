Ext.define('criterion.store.payroll.AssignmentsAvailable', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_payroll_assignments_available',

        model : 'criterion.model.payroll.AssignmentAvailable',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL_ASSIGNMENT_AVAILABLE
        }
    };
});
