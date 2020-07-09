Ext.define('criterion.model.ExternalSystem', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'externalSystemNameCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EXTERNAL_SYSTEM_NAME,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'externalSystemName',
                type : 'criterion_codedatavalue',
                referenceField : 'externalSystemNameCd',
                dataProperty : 'description',
                persist : false
            },
            {
                name : 'endPoint',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'userName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'password',
                type : 'string'
            },
            {
                name : 'sshKey',
                type : 'string'
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
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EXTERNAL_SYSTEM
        }
    };

});
