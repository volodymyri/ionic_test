Ext.define('criterion.store.employeeGroup.LearningPaths', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_learning_paths',

        model : 'criterion.model.employeeGroup.LearningPath',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_LEARNING_PATH
        }
    };
});
