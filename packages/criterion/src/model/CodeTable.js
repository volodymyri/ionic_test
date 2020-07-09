Ext.define('criterion.model.CodeTable', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CODE_TABLE
        },

        idProperty : {
            name : 'name',
            type : 'string'
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isSystem',
                type : 'boolean'
            },
            {
                name : 'isCustom',
                type : 'boolean'
            },
            {
                name : 'attribute1Caption',
                allowNull : true,
                type : 'string'
            },
            {
                name : 'attribute2Caption',
                allowNull : true,
                type : 'string'
            },
            {
                name : 'attribute3Caption',
                allowNull : true,
                type : 'string'
            },
            {
                name : 'attribute4Caption',
                allowNull : true,
                type : 'string'
            },
            {
                name : 'attribute5Caption',
                allowNull : true,
                type : 'string'
            }
        ]
    };
});
