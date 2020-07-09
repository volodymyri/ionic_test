Ext.define('criterion.model.reviewTemplate.CompetenciesTree', function() {

    var DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory',
            appendId : false,
            reader : 'treeData'
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'competencyGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_COMPETENCY_GROUP
            },
            {
                name : 'reviewCompetencyId',
                type : 'integer'
            },
            {
                name : 'connectedItemId',
                type : 'integer'
            }
        ]
    };
});
