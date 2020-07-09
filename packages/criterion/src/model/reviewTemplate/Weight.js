Ext.define('criterion.model.reviewTemplate.Weight', function() {

    var DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'reviewTemplateId',
                type : 'integer'
            },
            {
                name : 'competencyGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_COMPETENCY_GROUP,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'competencyGroupDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'competencyGroupCd',
                dataProperty : 'description'
            },
            {
                name : 'weight',
                type : 'float'
            },
            {
                name : 'weightInPercent',
                persist : false,
                calculate : function(data) {
                    return data.weight * 100;
                }
            },
            {
                name : 'sequence',
                type : 'integer'
            }
        ]
    };
});
