Ext.define('criterion.store.workLocation.Employees', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.work_location_employees',

        model : 'criterion.model.employee.Search',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYEE
        }
    };
});

