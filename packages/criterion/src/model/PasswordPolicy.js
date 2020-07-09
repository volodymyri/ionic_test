Ext.define('criterion.model.PasswordPolicy', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        PASSWORD_COMPLEXITY = criterion.Consts.PASSWORD_COMPLEXITY;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PASSWORD_POLICY
        },

        convertOnSet : false,

        fields : [
            {
                name : 'tenantId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY],

                persist : false
            },
            {
                name : 'characters',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY],
                serialize : function(value, model) {
                    var complexityCheck = model.get('complexityCheck'),
                        characters = 0;

                    Ext.Object.each(model.get('complexityCheck'), function(key, val) {
                        if (val) {
                            characters += val;
                        }
                    });

                    return characters;
                },
                critical : true
            },
            {
                name : 'minimumLength',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'maximumAge',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'maximumAttempts',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'allowReuse',
                type : 'boolean'
            },
            {
                name : 'sessionTimeout',
                type : 'integer',
                defaultValue : 60
            },
            {
                name : 'policyScope',
                type : 'string',
                depends : 'tenantId',
                convert : function(value, model) {
                    return !model.get('tenantId') ? 'Global' : 'Local';
                },

                persist : false
            },
            {
                name : 'complexityCheck',
                depends : 'characters',
                convert : function(value, model) {
                    var complexityCheck = {};

                    Ext.Object.each(PASSWORD_COMPLEXITY, function(key, item) {
                        complexityCheck[key] = model.get('characters') & item.value;
                    });

                    return complexityCheck;
                },

                persist : false
            }
        ]
    };
});
