Ext.define('criterion.store.workLocation.AvailableEmployees', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.work_location_available_employees',

        model : 'criterion.model.employee.Search',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYEE_AVAILABLE
        }
    };
});
