Ext.define('criterion.model.employee.TimeOffPlan', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_PLAN_PERIODS
        },

        fields : [
            {
                name : 'timeOffPlanId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'accrualDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'isClosed',
                type : 'boolean'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'isManualOverride',
                type : 'boolean'
            },
            {
                name : 'carryover',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'carryoverExpired',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'carryoverUsed',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'potential',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accrued',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'used',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'planCode',
                type : 'string',
                persist : false
            },
            {
                name : 'planName',
                type : 'string',
                persist : false
            },
            {
                name : 'planIsAccrualInDays',
                type : 'boolean',
                persist : false
            },
            {
                name : 'showPotential',
                type : 'boolean'
            },
            {
                name : 'totalUsed',
                type : 'float',
                depends : ['carryoverUsed', 'used'],
                convert : function(value, record) {
                    return record.get('carryoverUsed') + record.get('used')
                },
                persist : false
            },
            {
                name : 'carryoverNet',
                type : 'float',
                depends : ['carryoverExpired', 'carryover'],
                convert : function(value, record) {
                    return record.get('carryover') - record.get('carryoverExpired')
                },
                persist : false
            },
            {
                name : 'totalNet',
                type : 'float',
                depends : ['carryoverNet', 'accrued', 'totalUsed'],
                convert : function(value, record) {
                    return record.get('carryoverNet') + record.get('accrued') - record.get('totalUsed')
                },
                persist : false
            }
        ]
    };
});
