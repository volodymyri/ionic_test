Ext.define('criterion.model.employer.position.Skill', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'positionId',
                type : 'int',
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
                convert : function(value, record) {
                    if (Ext.isFunction(record.getSkill) && record.getSkill()) {
                        if (value && value != record.getSkill().get('skillCategoryCd')) {
                            record.getSkill().set('skillCategoryCd', value);
                        }
                        return record.getSkill().get('skillCategoryCd')
                    } else if (record && record.get('skill')) {
                        if (value && value != record.get('skill').skillCategoryCd) {
                            record.get('skill').skillCategoryCd = value;
                        }
                        return record.get('skill').skillCategoryCd
                    } else {
                        return value;
                    }
                }
            }

        ],

        hasOne : [
            {
                model : 'criterion.model.Skill',
                name : 'skill',
                associationKey : 'skill'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_SKILL
        }
    };
});
