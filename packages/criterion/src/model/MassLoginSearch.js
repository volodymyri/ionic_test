Ext.define('criterion.model.MassLoginSearch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.MASS_LOGIN_SEARCH
        },

        fields : [
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'email',
                type : 'string'
            },
            {
                name : 'isActivated',
                type : 'boolean'
            },
            {
                name : 'isLocked',
                type : 'boolean'
            },
            {
                name : 'isPasswordSet',
                type : 'boolean'
            },
            {
                name : 'lastLoginTime',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            }
        ]
    };
});
