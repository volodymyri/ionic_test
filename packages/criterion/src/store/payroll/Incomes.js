Ext.define('criterion.store.payroll.Incomes', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_payroll_incomes',

        model : 'criterion.model.payroll.Income',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
