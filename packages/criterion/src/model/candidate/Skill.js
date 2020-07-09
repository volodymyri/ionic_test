Ext.define('criterion.model.candidate.Skill', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_SKILL
        },

        fields : [
            {
                name : 'candidateId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'skill',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
