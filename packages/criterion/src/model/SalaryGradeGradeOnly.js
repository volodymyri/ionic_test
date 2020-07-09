Ext.define('criterion.model.SalaryGradeGradeOnly', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'salaryGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALARY_GROUP
            },
            {
                name : 'salaryGradeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALARY_GRADE,
                critical : true
            },
            {
                name : 'salaryStepCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALARY_STEP
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'maxRate',
                type : 'float'
            },
            {
                name : 'minRate',
                type : 'float'
            },
            {
                name : 'employerId',
                type : 'integer'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.SALARY_GRADE
        }
    };
});
