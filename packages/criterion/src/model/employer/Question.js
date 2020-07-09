Ext.define('criterion.model.employer.Question', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'questionSetId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'questionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.QUESTION_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'questionTypeCode',
                type : 'criterion_codedatavalue',
                depends : 'questionTypeCd',
                referenceField : 'questionTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'responseCd',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'documentTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                allowNull : true
            },
            {
                name : 'subQuestionSetId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'maximumSize',
                type : 'integer'
            },
            {
                name : 'sequence',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'label',
                type : 'criterion_localization_string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isHidden',
                type : 'boolean'
            },
            {
                name : 'isResponseRequired',
                type : 'boolean'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_QUESTION
        }
    };
});
