Ext.define('criterion.model.codeTable.Detail', function() {

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
                name : 'codeTableId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'attribute1',
                type : 'string'
            },
            {
                name : 'attribute2',
                type : 'string'
            },
            {
                name : 'attribute3',
                type : 'string'
            },
            {
                name : 'attribute4',
                type : 'string'
            },
            {
                name : 'attribute5',
                type : 'string'
            },
            {
                name : 'isDefault',
                type : 'boolean'
            },
            {
                name : 'isActive',
                type : 'boolean'
            }
        ]
    };
});
