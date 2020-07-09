Ext.define('criterion.store.dashboard.subordinateTimesheet.AvailablePayCodes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_available_pay_codes',
        model : 'criterion.model.dashboard.subordinateTimesheet.AvailablePayCode',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_PAY_CODES
        }
    };

});
