Ext.define('criterion.store.TimesheetTypes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_timesheet_types',

        model : 'criterion.model.TimesheetType',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.TIMESHEET_TYPE
        }
    };
});

