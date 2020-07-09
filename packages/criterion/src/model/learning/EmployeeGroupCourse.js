Ext.define('criterion.model.learning.EmployeeGroupCourse', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'courseId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_COURSE
        }
    };
});
