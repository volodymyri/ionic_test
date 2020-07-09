Ext.define('criterion.model.ReviewCompetency', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_COMPETENCY
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'reviewCompetencyGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_COMPETENCY_GROUP,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reviewCompetencyGroupDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'reviewCompetencyGroupCd',
                dataProperty : 'description'
            },
            {
                name : 'reviewScaleId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'groupSequence',
                type : 'integer'
            }
        ]
    };
});
