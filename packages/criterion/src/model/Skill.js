Ext.define('criterion.model.Skill', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'skillCategoryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SKILL_CATEGORY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.SKILL
        }
    };
});
