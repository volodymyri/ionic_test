Ext.define('criterion.model.ReviewTemplate', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.reviewTemplate.Weight',
            'criterion.model.reviewTemplate.Competency'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE
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
                name : 'isActive',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'isCompetencyManualRating',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isGoalManualRating',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'reviewScaleId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },

            {
                name : 'goalWeight',
                type : 'float'
            },
            {
                name : 'competencyWeightInPercent',
                persist : false,
                calculate : data => 100 - parseInt(data.goalWeight * 100, 10)
            },
            {
                name : 'goalWeightInPercent',
                persist : false,
                calculate : data => parseInt(data.goalWeight * 100, 10)
            },
            {
                name : 'goalReviewScaleId',
                type : 'integer',
                allowNull : true
            },

            {
                name : 'countGroups',
                type : 'integer',
                persist : false
            },
            {
                name : 'countCompetencies',
                type : 'integer',
                persist : false
            },

            {
                name : 'isRecruiting',
                type : 'boolean',
                defaultValue : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.reviewTemplate.Weight',
                name : 'weights',
                associationKey : 'weights'
            },
            {
                model : 'criterion.model.reviewTemplate.Competency',
                name : 'competencies',
                associationKey : 'competencies'
            }
        ]
    };
});
