Ext.define('criterion.store.employer.shift.occurrence.Employees', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.shift.occurrence.Employee',
        alias : 'store.criterion_employer_shift_occurrence_employees',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_EMPLOYEE,
            batchOrder : 'destroy,create,update' // order was change for a correct validation in the BE part
        }
    };
});

