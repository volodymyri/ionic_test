Ext.define('criterion.store.employer.shift.occurrence.EmployeesByDetail', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.shift.occurrence.EmployeeByDetail',
        alias : 'store.criterion_employer_shift_occurrence_employees_by_detail',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_EMPLOYEE_BY_DETAIL
        }
    };
});

