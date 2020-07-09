Ext.define('criterion.store.SalaryGradesGradeStep', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_salary_grades_grade_step',

        model : 'criterion.model.SalaryGradeGradeStep',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.SALARY_GRADE
        }
    };
});
