Ext.define('criterion.model.employer.BenefitPlan', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        alternateClassName : [
            'criterion.model.employer.BenefitPlan'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_BENEFIT_PLAN
        },

        fields : [
            // plan info
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'benefitTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.BENEFIT_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'deductionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'planRateDescription',
                type : 'string',
                persist : false
            },
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
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'carrierId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'groupNumber',
                type : 'string'
            },
            {
                name : 'carrierName',
                type : 'string',
                persist : false
            },
            {
                name : 'carrierAccountNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'yearEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                type : 'criterion_codedatavalue',
                name : 'rateUnitDesc',
                referenceField : 'rateUnitCd'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'isElective',
                type : 'boolean'
            },
            {
                name : 'isCobra',
                type : 'boolean'
            },
            {
                name : 'isAca',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isSelfInsured',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isCafe',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isAllowChangeEss',
                type : 'boolean',
                defaultValue : true
            },
            // contact info
            {
                name : 'contactName',
                type : 'string'
            },
            {
                name : 'contactTitle',
                type : 'string'
            },
            {
                name : 'contactPhone',
                type : 'string'
            },
            {
                name : 'contactPhoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'contactAddress',
                type : 'string'
            },
            // formulas/expressions
            {
                name : 'expCalcEmployeeCoverage',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'expCalcEmployeeContribution',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'expCalcEligibility',
                type : 'string',
                serialize : criterion.Utils.emptyToNull,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'expCalcPlanPremium',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'expCalcDependentCoverage',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'expCalcEffectiveDate',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'expCalcExpirationDate',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },

            {
                name : 'optionGroup1',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'optionGroup2',
                type : 'string',
                allowNull : true,
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'optionGroup3',
                type : 'string',
                allowNull : true,
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'optionGroup4',
                type : 'string',
                allowNull : true,
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'optionGroupIsManual',
                type : 'integer'
            },
            {
                name : 'optionGroupIsManualCalc',
                type : 'integer',
                persist : false,
                depends : 'optionGroupIsManual',
                convert : function(value, record) {
                    var optionGroupIsManual = record.get('optionGroupIsManual'),
                        values = {};

                    for (var i = 1; i <= 4; i++) {
                        values[Ext.util.Format.format('optionGroup{0}IsManual', i)] = Boolean(optionGroupIsManual & 1 << (4 - i));
                    }

                    record.set(values);

                    return optionGroupIsManual
                }
            },
            {
                name : 'optionGroup1IsManual',
                type : 'boolean',
                persist : false
            },
            {
                name : 'optionGroup2IsManual',
                type : 'boolean',
                persist : false
            },
            {
                name : 'optionGroup3IsManual',
                type : 'boolean',
                persist : false,
                depends : 'optionGroupIsManual'
            },
            {
                name : 'optionGroup4IsManual',
                type : 'boolean',
                persist : false,
                depends : 'optionGroupIsManual'
            },
            {
                name : 'costVisibilityCode',
                type : 'string',
                persist : false
            },
            {
                name : 'showEmployeeCost',
                type : 'boolean',
                calculate : function(data) {
                    return data && Ext.Array.contains([
                            criterion.Consts.COST_VISIBILITY.EMPLOYEE, criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER
                        ], data['costVisibilityCode'])
                }
            },
            {
                name : 'showEmployerCost',
                type : 'boolean',
                calculate : function(data) {
                    return data && data['costVisibilityCode'] === criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER;
                }
            },
            {
                name : 'webformId',
                type : 'integer',
                allowNull : true
            }
        ],

        getGroupFields : function() {
            return ['optionGroup1', 'optionGroup2', 'optionGroup3', 'optionGroup4'];
        },

        hasMany : [
            {
                model : 'employer.benefit.Option',
                name : 'options',
                associationKey : 'options'
            }
        ]
    };
});
