Ext.define('criterion.model.employer.benefitPlan.EligibleEmployee', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.benefitPlan.EligibleEmployeeContact'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_BENEFIT_PLAN_ELIGIBLE_EMPLOYEE
        },

        fields : [
            {
                name : 'selected',
                type : 'boolean',
                persist : false,
                defaultValue : false
            },
            {
                name : 'isAllowBeneficiary_1',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowDependent_1',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowBeneficiary_2',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowDependent_2',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowBeneficiary_3',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowDependent_3',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowBeneficiary_4',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAllowDependent_4',
                type : 'boolean',
                persist : false
            },

            {
                name : 'widgetBeneficiary_disabled',
                type : 'boolean',
                calculate : function(record) {
                    return !record || !record.selected || (!record.isAllowBeneficiary_1 && !record.isAllowBeneficiary_2 && !record.isAllowBeneficiary_3 && !record.isAllowBeneficiary_4)
                }
            },
            {
                name : 'widgetDependent_disabled',
                type : 'boolean',
                calculate : function(record) {
                    return !record || !record.selected || (!record.isAllowDependent_1 && !record.isAllowDependent_2 && !record.isAllowDependent_3 && !record.isAllowDependent_4)
                }
            },
            {
                name : 'optionGroup1',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'optionGroup2',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'optionGroup3',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'optionGroup4',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'beneficiaries',
                type : 'auto',
                allowNull : true,
                persist : false
            },
            {
                name : 'dependents',
                type : 'auto',
                allowNull : true,
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.benefitPlan.EligibleEmployeeContact',
                name : 'contacts',
                associationKey : 'contacts'
            }
        ]
    };
});
