Ext.define('criterion.controller.ess.payroll.Deductions', function() {

    return {

        alias : 'controller.criterion_selfservice_payroll_deductions',

        extend : 'criterion.controller.employee.payroll.Deductions',

        suppressIdentity : ['employeeContext'],

        handleEditAction : Ext.emptyFn
    };
});
