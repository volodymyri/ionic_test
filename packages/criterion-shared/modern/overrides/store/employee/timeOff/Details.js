Ext.define('criterion.store.employee.timeOff.ModernDetails', {

    override : 'criterion.store.employee.timeOff.Details',

    constructor : function() {
        this.callParent(arguments);

        this.setProxy({
            type : 'criterion_rest',
            url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_DETAIL
        });
    }
});
