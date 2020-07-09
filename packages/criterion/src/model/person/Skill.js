Ext.define('criterion.model.person.Skill', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.person.Abstract',

        requires : [
            'criterion.model.Skill',
            'criterion.model.workflow.transaction.Log'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_SKILL
        },

        fields : [
            {
                name : 'skillId',
                type : 'int',
                allowNull : true,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'skillName',
                type : 'string',

                mapping : 'skill.name',
                persist : false
            },
            {
                name : 'skillCategoryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SKILL_CATEGORY,

                mapping : 'skill.skillCategoryCd',
                persist : false
            },
            {
                name : 'skillLevelCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SKILL_LEVEL,

                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'dateAcquired',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'autoAssigned',
                type : 'bool',
                defaultValue : false
            },

            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'workflowLogId',
                type : 'integer',
                allowNull : true,
                persist : false
            },
            {
                name : 'status',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'description'
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'code'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Skill',
                name : 'skill',
                associationKey : 'skill',
                foreignKey : 'skillId'
            },
            {
                model : 'criterion.model.workflow.transaction.Log',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ]
    };
});
