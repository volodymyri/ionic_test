Ext.define('criterion.model.DocumentLocation', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.codeTable.Detail',

        fields : [
            {
                name : 'documentLocationCd',
                type : 'criterion_codedata',
                persist : false,
                codeDataId : criterion.consts.Dict.DOCUMENT_LOCATION_TYPE
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.DOCUMENT_LOCATION
        }
    };
});
