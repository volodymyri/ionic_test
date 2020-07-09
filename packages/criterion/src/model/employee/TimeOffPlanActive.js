Ext.define('criterion.model.employee.TimeOffPlanActive', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_PLAN_ACTIVE
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
                name : 'isClosed',
                type : 'boolean'
            },
            {
                name : 'accrualDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'carryover',
                type : 'float'
            },
            {
                name : 'carryoverExpired',
                type : 'float'
            },
            {
                name : 'potential',
                type : 'float'
            },
            {
                name : 'accrued',
                type : 'float'
            },
            {
                name : 'used',
                type : 'float'
            },
            {
                name : 'carryoverUsed',
                type : 'float'
            },
            {
                name : 'isManualOverride',
                type : 'boolean'
            },
            {
                name : 'planCode',
                type : 'string'
            },
            {
                name : 'planName',
                type : 'string'
            },
            {
                name : 'types',
                type : 'string'
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
                name : 'totalNet',
                type : 'float',
                depends : ['carryoverExpired', 'carryover', 'accrued', 'totalUsed'],
                convert : function(value, record) {
                    return record.get('carryover') - record.get('carryoverExpired') + record.get('accrued') - record.get('totalUsed')
                },
                persist : false
            },
            {
                name : 'available',
                type : 'float',
                depends : ['carryoverExpired', 'carryover', 'carryoverUsed', 'accrued', 'used'],
                convert : function(value, record) {
                    return record.get('carryover') - record.get('carryoverExpired') - record.get('carryoverUsed') + record.get('accrued') - record.get('used')
                },
                persist : false
            }
        ]
    };
});
