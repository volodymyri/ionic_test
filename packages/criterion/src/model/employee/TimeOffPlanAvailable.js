Ext.define('criterion.model.employee.TimeOffPlanAvailable', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_PLAN_AVAILABLE
        },

        fields : [
            {
                name : 'timeOffPlanId',
                type : 'integer'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'accrualDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'planCode',
                convert : function(value, record) {
                    var plan = record.get('timeOffPlan');

                    return plan && plan['code'];
                }
            },
            {
                name : 'planName',
                convert : function(value, record) {
                    var plan = record.get('timeOffPlan');

                    return plan && plan['name'];
                }
            },
            {
                name : 'planIsActive',
                convert : function(value, record) {
                    var plan = record.get('timeOffPlan');

                    return plan && plan['isActive'];
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employer.TimeOffPlan',
                name : 'timeOffPlan',
                associationKey : 'timeOffPlan'
            }
        ]
    };
});
