Ext.define('criterion.model.employee.openEnrollment.Step', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_OPEN_ENROLLMENT_STEP
        },

        fields : [
            {
                name : 'employeeOpenEnrollmentId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'openEnrollmentStepId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'benefitPlanId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'isEnroll',
                type : 'boolean'
            }
        ],
        hasMany : [
            {
                model : 'criterion.model.employee.benefit.Option',
                name : 'options',
                associationKey : 'options'
            }
        ]
    };
});
