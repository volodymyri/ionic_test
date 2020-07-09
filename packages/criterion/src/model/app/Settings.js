Ext.define('criterion.model.app.Settings', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.app.CustomSettings'
        ],

        fields : [
            {
                name : 'userId',
                type : 'string'
            },
            {
                name : 'password',
                type : 'string'
            },
            {
                name : 'token',
                type : 'string',
                persist : false
            },
            {
                name : 'logLevel',
                type : 'string',
                defaultValue : criterion.Consts.LOG_LEVEL.OFF.value
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.app.CustomSettings',
                name : 'customSettings',
                associationKey : 'customSettings'
            }
        ]
    };
});
