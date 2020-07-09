Ext.define('criterion.model.employer.jobPosting.candidate.interview.Review', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.jobPosting.candidate.interview.Detail',
            'criterion.model.ReviewCompetency',
            'criterion.model.reviewScale.Detail',
            'criterion.model.employer.jobPosting.candidate.interview.ReviewDetail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_REVIEW
        },

        fields : [
            {
                name : 'jobPostingCandidateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'interviewTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.INTERVIEW_REVIEW_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'interviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'interviewDateDate',
                persist : false
            },
            {
                name : 'interviewDateTime',
                persist : false
            },
            {
                name : 'interviewDuration',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'interviewAddress',
                type : 'string'
            },
            {
                name : 'sendEmail',
                type : 'boolean'
            },
            {
                name : 'message',
                type : 'string'
            },
            {
                name : 'accessKey',
                type : 'string',
                persist : false
            },

            {
                name : 'isCompetencyManualRating',
                type : 'boolean',
                persist : false,
                defaultValue : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.jobPosting.candidate.interview.Detail',
                name : 'details',
                associationKey : 'details'
            },
            {
                model : 'criterion.model.ReviewCompetency',
                name : 'reviewCompetency',
                associationKey : 'reviewCompetency'
            },
            {
                model : 'criterion.model.reviewScale.Detail',
                name : 'reviewScaleDetails',
                associationKey : 'reviewScaleDetails'
            },
            {
                model : 'criterion.model.employer.jobPosting.candidate.interview.ReviewDetail',
                name : 'reviewDetails',
                associationKey : 'reviewDetails'
            }
        ]
    };
});
