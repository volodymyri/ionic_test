Ext.define('criterion.model.SalaryGradeStep', function() {

    return {
        extend : 'Ext.data.Model',

        alias : 'model.criterion_salary_grade_step',

        idProperty : 'salaryGradeId',

        fields : [
            {
                name : 'salaryStepCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.SALARY_STEP
            },
            {
                name : 'stepName',
                type : 'string',
                persist : false
            },
            {
                name : 'rate',
                type : 'float'
            }
        ],

        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        }
    };
});
