Ext.define('criterion.model.vertex.FilingStatus', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.VERTEX_FILING_STATUS
        },

        fields : [
            {
                name : 'geoCode',
                type : 'string'
            },
            {
                name : 'taxId',
                type : 'integer'
            },
            {
                name : 'taxName',
                type : 'string'
            },
            {
                name : 'jurisdictionDescription',
                type : 'string'
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'taxTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TAX_TYPE
            }
        ]
    };
});
