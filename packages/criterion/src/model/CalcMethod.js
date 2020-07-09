Ext.define('criterion.model.CalcMethod', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'method',
                type : 'string'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.CALC_METHOD
        }
    };
});