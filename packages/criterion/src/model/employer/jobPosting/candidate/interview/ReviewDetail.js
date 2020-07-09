Ext.define('criterion.model.employer.jobPosting.candidate.interview.ReviewDetail', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'jobPostingCandidateInterviewReviewId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reviewCompetencyId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reviewScaleDetailId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'rating',
                type : 'float',
                allowNull : true
            },
            {
                name : 'reviewComments',
                type : 'string'
            }
        ]
    };
});

