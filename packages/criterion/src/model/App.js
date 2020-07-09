Ext.define('criterion.model.App', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.app.Settings',
            'criterion.model.app.CustomButtons'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.APP
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'vendor',
                type : 'string'
            },
            {
                name : 'version',
                type : 'number'
            },
            {
                name : 'endpoint',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.app.Settings',
                name : 'appSettings',
                associationKey : 'appSettings'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.app.CustomButtons',
                name : 'customButtons',
                associationKey : 'customButtons'
            }
        ]

    };
});
