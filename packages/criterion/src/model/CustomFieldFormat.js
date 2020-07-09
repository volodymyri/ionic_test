Ext.define('criterion.model.CustomFieldFormat', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.FIELD_FORMAT_CUSTOM
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'mask',
                type : 'string'
            },
            {
                name : 'validityTest',
                type : 'string'
            },
            {
                name : 'vtype',
                type : 'string',
                depends : ['validityTest'], // workaround - actually it depends just on id
                convert : function(value, rec) {
                    return 'customFieldFormat' + rec.getData().id
                },
                persist : false
            }
        ]
    };
});
