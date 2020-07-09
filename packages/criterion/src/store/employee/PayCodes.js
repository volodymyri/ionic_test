Ext.define('criterion.store.employee.PayCodes', function() {

    return {
        extend : 'criterion.data.Store',

        model : 'criterion.model.employee.PayCode',
        alias : 'store.criterion_employee_paycodes',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        data : [
            {
                id : 1,
                paycode : 1,
                name : 'Regular Hours'
            }
        ]


    };

});
