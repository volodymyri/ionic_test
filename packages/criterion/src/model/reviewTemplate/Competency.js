Ext.define('criterion.model.reviewTemplate.Competency', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE_COMPETENCY
        },

        fields : [
            {
                name : 'reviewTemplateId',
                validators : [VALIDATOR.NON_EMPTY],
                type : 'integer'
            },
            {
                name : 'reviewCompetencyId',
                validators : [VALIDATOR.NON_EMPTY],
                type : 'integer'
            },
            {
                name : 'competencyName',
                type : 'string',
                persist : false
            },
            {
                name : 'competencyGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_COMPETENCY_GROUP,
                persist : false
            },
            {
                name : 'competencyGroupDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'competencyGroupCd',
                dataProperty : 'description',
                depends : 'competencyGroupCd'
            },
            {
                name : 'sequence',
                type : 'integer'
            }
        ]
    };
});
