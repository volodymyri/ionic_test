Ext.define('criterion.store.employee.teamTimeOff.Details', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_team_time_off_details',

        model : 'criterion.model.employee.teamTimeOff.Detail',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TEAM_TIME_OFF_DETAIL
        }
    };

});
