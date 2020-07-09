Ext.define('criterion.model.employer.TimeOffPlan', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TIME_OFF_PLAN
        },

        fields : [
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'expCarryover',
                type : 'string'
            },
            {
                name : 'carryoverExpireDays',
                type : 'int',
                validators : [VALIDATOR.POSITIVE_OR_ZERO, VALIDATOR.NON_EMPTY]
            },
            {
                name : 'expThreshold',
                type : 'string'
            },
            {
                name : 'expCalcEligibility',
                type : 'string',
                allowNull : true
            },
            {
                name : 'expCalcEffectiveDate',
                type : 'string',
                allowNull : true
            },
            {
                name : 'expWaitingPeriod',
                type : 'string',
                allowNull : true
            },
            {
                name : 'accrualMethodTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.ACCRUAL_METHOD_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accrualMethodTypeCode',
                type : 'criterion_codedatavalue',
                depends : 'accrualMethodTypeCd',
                referenceField : 'accrualMethodTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'accrualPeriodCd',
                type : 'criterion_codedata',
                codeDataId : DICT.ACCRUAL_PERIOD
            },
            {
                name : 'accrualPeriodCode',
                type : 'criterion_codedatavalue',
                depends : 'accrualPeriodCd',
                referenceField : 'accrualPeriodCd',
                dataProperty : 'code'
            },
            {
                name : 'yearEndYear',
                type : 'int',
                allowNull : true
            },
            {
                name : 'yearEndDate',
                type : 'date',
                allowNull : true,
                dateFormat : criterion.consts.Api.DATE_MONTH_DAY,
                defaultValue : '01-01'
            },
            {
                name : 'expCalcAccrued',
                type : 'string',
                allowNull : true
            },
            {
                name : 'showPotential',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'allowNegative',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isActive',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'incomeListId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'incomeCode',
                type : 'string'
            },
            {
                name : 'isAccrualInDays',
                type : 'boolean',
                defaultValue : false
            },

            {
                name : 'firstPeriodProrateType',
                type : 'integer'
            },

            {
                name : 'isOddWeek',
                type : 'boolean',
                allowNull : true,
                defaultValue : false
            },

            {
                name : 'isAccrualInAdvance',
                type : 'boolean'
            },

            {
                name : 'startDayOfWeek',
                type : 'int',
                allowNull : true,
                defaultValue : 1
            },

            {
                name : 'startDayOfMonth',
                type : 'int',
                allowNull : true
            },
            {
                name : 'isAllDayOnly',
                type : 'boolean'
            },
            {
                name : 'isIncludeHolidays',
                type : 'boolean'
            },
            {
                name : 'isIncludeClosedDays',
                type : 'boolean'
            },
            {
                name : 'periodTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PERIOD_TYPE
            },
            {
                name : 'periodTypeCode',
                type : 'criterion_codedatavalue',
                depends : 'periodTypeCd',
                referenceField : 'periodTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'maxPerRequest',
                type : 'int',
                defaultValue : 0
            },
            {
                name : 'accrualDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'accrualCap',
                type : 'float',
                allowNull : true
            },
            {
                name : 'notesOptional',
                type : 'boolean'
            },
            {
                name : 'expNegativeCap',
                type : 'string'
            }
        ]
    };
});



