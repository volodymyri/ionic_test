Ext.define('criterion.model.payGroup.Employee', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'payGroupId',
                type : 'integer'
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'employeeName',
                type : 'string'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PAY_GROUP_EMPLOYEE
        }
    };
});
