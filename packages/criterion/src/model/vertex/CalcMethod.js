Ext.define('criterion.model.vertex.CalcMethod', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();


    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'code',
                type : 'int'
            },
            {
                name : 'method',
                type : 'string'
            }
        ]
    };
});
