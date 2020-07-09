Ext.define('criterion.store.employee.ModernTimeOffs', {

    override : 'criterion.store.employee.TimeOffs',

    constructor : function() {
        this.callParent(arguments);

        this.setProxy({
            type : 'criterion_rest',
            url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF
        });
    }
});
