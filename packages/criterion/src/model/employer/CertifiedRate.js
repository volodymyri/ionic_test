Ext.define('criterion.model.employer.CertifiedRate', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.certifiedRate.Detail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.CERTIFIED_RATE
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'union',
                type : 'string'
            },
            {
                name : 'local',
                type : 'string'
            },
            {
                name : 'rateEffectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rateExpirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'firstPayrollPeriodId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'finalPayrollPeriodId',
                type : 'integer'
            },
            {
                name : 'firstPayrollPeriodStartDate',
                type : 'date',
                persist : false,
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'firstPayrollPeriodEndDate',
                type : 'date',
                persist : false,
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'finalPayrollPeriodStartDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'finalPayrollPeriodEndDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'isContractor',
                type : 'boolean'
            },
            {
                name : 'projectNumber',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.certifiedRate.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
