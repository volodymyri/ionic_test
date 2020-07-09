Ext.define('criterion.model.employee.teamTimeOff.Detail', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.teamTimeOff.DetailInner'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TEAM_TIME_OFF_DETAIL
        },

        idProperty : 'employeeId',

        fields : [
            {
                name : 'employeeId',
                type : 'integer'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.teamTimeOff.DetailInner',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
