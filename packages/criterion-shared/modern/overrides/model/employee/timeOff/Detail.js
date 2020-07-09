Ext.define('criterion.model.employee.timeOff.ModernDetail', {

    override : 'criterion.model.employee.timeOff.Detail',

    proxy : {
        type : 'criterion_rest',
        url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_DETAIL
    }

});
