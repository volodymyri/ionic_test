Ext.define('criterion.store.employee.timesheet.ByDateDetail', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_timesheet_details_by_date_detail',

        model : 'criterion.model.employee.timesheet.ByDateDetail',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
