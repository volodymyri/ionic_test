Ext.define('criterion.store.employeeGroup.TimesheetTypes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_timesheet_types',

        model : 'criterion.model.employeeGroup.TimesheetType',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_TIMESHEET_TYPE
        }
    };
});
