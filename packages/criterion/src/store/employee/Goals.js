Ext.define('criterion.store.employee.Goals', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_goals',

        model : 'criterion.model.employee.Goal',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
