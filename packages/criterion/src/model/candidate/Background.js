Ext.define('criterion.model.candidate.Background', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_BACKGROUND
        },

        fields : [
            {
                name : 'candidateId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'externalSystemCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EXTERNAL_SYSTEM_NAME,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'orderRef',
                type : 'string'
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.BACKGROUND_CHECK_STATUS,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'statusDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                dataProperty : 'description'
            },
            {
                name : 'response',
                type : 'string'
            },
            {
                name : 'updated',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'reportUrl',
                type : 'string'
            }
        ]
    };
});
