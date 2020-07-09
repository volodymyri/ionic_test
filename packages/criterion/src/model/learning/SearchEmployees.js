Ext.define('criterion.model.learning.SearchEmployees', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.employee.Search',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_GET_EMPLOYEES_FOR_COURSE
        },

        fields : [
            {
                name : 'jobTitle',
                type : 'string'
            }
        ]
    };
});
