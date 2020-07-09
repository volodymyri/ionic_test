Ext.define('criterion.store.timesheetLayout.Details', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_timesheet_details',

        model : 'criterion.model.timesheetLayout.Detail',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
