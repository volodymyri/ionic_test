Ext.define('criterion.model.person.LoginEnable', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_IS_LOGIN_ENABLE
        },

        fields : [
            {
                name : 'enable',
                type : 'boolean'
            },
            {
                name : 'login',
                type : 'string'
            },
            {
                name : 'is2faEnabled',
                type : 'boolean'
            },
            {
                name : 'isExternal',
                type : 'boolean'
            }
        ]
    };
});
