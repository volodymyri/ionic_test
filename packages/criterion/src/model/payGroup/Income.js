Ext.define('criterion.model.payGroup.Income', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'payGroupId',
                type : 'integer'
            },
            {
                name : 'incomeListId',
                type : 'integer'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PAY_GROUP_INCOME
        }
    };
});
