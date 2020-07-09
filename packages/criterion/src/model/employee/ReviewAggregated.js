Ext.define('criterion.model.employee.ReviewAggregated', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employee.Review'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_REVIEW_AGGREGATED
        },

        fields : [
            {
                name : 'employeeFullName',
                type : 'string'
            },
            {
                name : 'reviewPeriodName',
                type : 'string',
                persist : false
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
                name: 'overallScoreDetails'
            },
            {
                name : 'overallRatingReviewScaleName',
                type : 'string',
                mapping : 'overallScoreDetails.overallRatingReviewScaleName'
            },
            {
                name : 'isAggregatedOverallScoreDisplayed',
                type : 'boolean'
            },
            {
                name : 'goalScoreInPercent',
                persist : false,
                calculate : function(data) {
                    return data.overallScoreDetails ? parseInt(data.overallScoreDetails.goalScore * 100, 10) : 0;
                }
            },
            {
                name : 'competencyScoreInPercent',
                persist : false,
                calculate : function(data) {
                    return data.overallScoreDetails ? parseInt(data.overallScoreDetails.competencyScore * 100, 10) : 0;
                }
            },
            {
                name : 'overallScoreInPercent',
                persist : false,
                calculate : function(data) {
                    return data.overallScoreDetails ? parseInt(data.overallScoreDetails.overallScore * 100, 10) : 0;
                }
            },
            {
                name : 'competencyGroups'
            },
            {
                name : 'competencyGroupScores',
                mapping : 'overallScoreDetails.competencyGroupScores'
            },
            {
                name : 'canShowGoals',
                type : 'boolean'
            },
            {
                name : 'goals'
            },
            {
                name : 'isAggregated',
                type : 'boolean'
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
                name : 'isPublishedForReviewer',
                type : 'boolean'
            },
            {
                name : 'isPublishedForManager',
                type : 'boolean'
            },
            {
                name : 'isAggregated',
                type : 'boolean',
                persist : false
            },
            {
                name : 'reviewPeriodId',
                type : 'integer'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.Review',
                name : 'reviews',
                associationKey : 'reviews'
            }
        ]
    };
});
