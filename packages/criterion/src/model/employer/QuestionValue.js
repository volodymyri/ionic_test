Ext.define('criterion.model.employer.QuestionValue', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'questionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'jobPostingCandidateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'value',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'localizationLanguageCd',
                type : 'criterion_codedata',
                codeDataId : DICT.LOCALIZATION_LANGUAGE,
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_QUESTION_VALUE
        }
    };
});
