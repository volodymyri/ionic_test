Ext.define('criterion.model.FieldFormatType', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'typeValue',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
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
                    return 'fieldFormat' + rec.getData().id
                },
                persist : false
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.FIELD_FORMAT_TYPE
        }
    };
});
