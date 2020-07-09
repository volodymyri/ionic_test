Ext.define('criterion.model.employee.review.CompetencyGroupScore', function() {

    var DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'employeeReviewId',
                type : 'integer'
            },
            {
                name : 'reviewCompetencyGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_COMPETENCY_GROUP
            },
            {
                name : 'reviewCompetencyGroupSequence',
                type : 'criterion_codedatavalue',
                referenceField : 'reviewCompetencyGroupCd',
                dataProperty : 'attribute1'
            },
            {
                name : 'score',
                type : 'float'
            },
            {
                name : 'scoreInPercent',
                persist : false,
                calculate : data => parseInt(data.score * 100, 10)
            }
        ]
    };
});
