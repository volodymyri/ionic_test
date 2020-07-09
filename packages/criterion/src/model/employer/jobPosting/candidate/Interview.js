Ext.define('criterion.model.employer.jobPosting.candidate.Interview', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.jobPosting.candidate.interview.Detail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW
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
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.jobPosting.candidate.interview.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
