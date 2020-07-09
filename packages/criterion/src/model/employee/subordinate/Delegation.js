Ext.define('criterion.model.employee.subordinate.Delegation', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.employee.Delegation',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_SUBORDINATE_DELEGATION
        }
    };
});
