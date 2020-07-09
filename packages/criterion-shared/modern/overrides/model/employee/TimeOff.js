Ext.define('criterion.model.employee.ModernTimeOff', {

    override : 'criterion.model.employee.TimeOff',

    requires : [
        'criterion.model.employee.timeOff.ModernDetail'
    ],

    proxy : {
        type : 'criterion_rest',
        url : criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF
    },

    hasMany : [
        {
            model : 'criterion.model.employee.timeOff.ModernDetail',
            name : 'details',
            associationKey : 'details'
        }
    ]

});
