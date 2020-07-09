Ext.define('criterion.model.employer.Classification', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_CLASSIFICATION
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'codeDataTypeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'caption',
                type : 'string'
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'values'
            }
        ]
    };

});
