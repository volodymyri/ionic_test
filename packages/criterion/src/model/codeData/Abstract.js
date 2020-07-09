Ext.define('criterion.model.codeData.Abstract', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CODE_TABLE_DETAIL
        },

        fields : [
            {
                name : 'code',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'description',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            }
        ]
    };
});
