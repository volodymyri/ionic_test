Ext.define('criterion.model.employee.Review', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employee.ReviewDetail',
            'criterion.model.employee.Goal',
            'criterion.model.reviewTemplate.Period',
            'criterion.model.employee.review.CompetencyGroupScore'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_REVIEW
        },

        fields : [
            {
                name : 'reviewPeriodId',
                type : 'int',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'reviewPeriodName',
                type : 'string',
                persist : false
            },
            {
                name : 'reviewTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_TYPE,
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'periodStart',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'periodEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewDeadline',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'nextReviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewerId',
                type : 'int',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'reviewerFullName',
                type : 'string',
                persist : false
            },
            {
                name : 'approverFullName',
                type : 'string',
                persist : false
            },
            {
                name : 'anonymousLevel',
                type : 'integer',
                defaultValue : 0
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKFLOW_STATE
            },
            {
                name : 'reviewStatusCode',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                dataProperty : 'code'
            },
            {
                name : 'isPublished',
                type : 'boolean'
            },
            {
                name : 'isViewed',
                type : 'boolean'
            },
            {
                name : 'goalScore',
                persist : false,
                type : 'float'
            },
            {
                name : 'goalScoreInPercent',
                persist : false,
                calculate : data => parseInt(data.goalScore * 100, 10)
            },
            {
                name : 'competencyScore',
                persist : false,
                type : 'float'
            },
            {
                name : 'competencyScoreInPercent',
                persist : false,
                calculate : data => parseInt(data.competencyScore * 100, 10)
            },
            {
                name : 'overallScore',
                persist : false,
                type : 'float'
            },
            {
                name : 'overallScoreInPercent',
                persist : false,
                calculate : data => parseInt(data.overallScore * 100, 10)
            },
            {
                name : 'reviewScaleId',
                type : 'integer'
            },
            {
                name : 'overallRatingReviewScaleName',
                persist : false,
                type : 'string'
            },
            {
                name : 'isAggregatedReviewDetail',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isPublishedForReviewer',
                type : 'boolean'
            },
            {
                name : 'isPublishedForManager',
                type : 'boolean'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.ReviewDetail',
                name : 'employeeReviewDetails',
                associationKey : 'employeeReviewDetails'
            },
            {
                model : 'criterion.model.employee.Goal',
                name : 'goals',
                associationKey : 'goals'
            },
            {
                model : 'criterion.model.employee.review.CompetencyGroupScore',
                name : 'competencyGroupScores',
                associationKey : 'competencyGroupScores'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.reviewTemplate.Period',
                name : 'reviewPeriod',
                associationKey : 'reviewPeriod'
            }
        ]
    };
});
