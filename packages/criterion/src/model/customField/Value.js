Ext.define('criterion.model.customField.Value', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.CustomFieldValue'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.CUSTOM_VALUE
        },

        fields : [
            {
                name : 'entityId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'customFieldId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'customField'
            },
            {
                name : 'dataType',
                type : 'string',
                persist : false
            },
            {
                name : 'value',
                type : 'custom_field_value',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };

});
