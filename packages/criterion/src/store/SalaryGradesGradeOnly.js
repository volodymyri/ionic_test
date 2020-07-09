Ext.define('criterion.store.SalaryGradesGradeOnly', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_salary_grades_grade_only',

        model : 'criterion.model.SalaryGradeGradeOnly',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.SALARY_GRADE
        }
    };
});

