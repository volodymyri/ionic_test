Ext.define('criterion.model.employee.openEnrollment.CurrentPlan', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OPEN_ENROLLMENT_STEP_CURRENT_PLAN
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'benefitPlanId',
                type : 'int'
            },
            {
                name : 'employeeCoverage',
                type : 'float'
            },
            {
                name : 'dependentCoverage',
                type : 'float'
            },
            {
                name : 'employerContribution',
                type : 'float'
            },
            {
                name : 'employeeContribution',
                type : 'float'
            },
            {
                name : 'isManualOverride',
                type : 'boolean'
            },
            {
                name : 'costVisibilityCode',
                type : 'string'
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
            }
        ]
    };
});
