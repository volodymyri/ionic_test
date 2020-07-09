Ext.define('criterion.model.employer.course.Skill', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'courseId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'skillId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'skillLevelCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SKILL_LEVEL,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'skillCategoryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SKILL_CATEGORY,
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE_SKILL
        }
    };
});
