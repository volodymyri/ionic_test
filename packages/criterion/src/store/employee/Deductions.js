Ext.define('criterion.store.employee.Deductions', function() {

    return {

        extend : 'criterion.data.Store',
        model : 'criterion.model.employee.Deduction',
        alias : 'store.criterion_employee_deduction',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };
});
