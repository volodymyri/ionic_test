Ext.define('criterion.store.learning.SearchEmployees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_search_employees',

        model : 'criterion.model.learning.SearchEmployees',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_GET_EMPLOYEES_FOR_COURSE
        }
    };
});
