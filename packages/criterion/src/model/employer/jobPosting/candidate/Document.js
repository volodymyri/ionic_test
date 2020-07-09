Ext.define('criterion.model.employer.jobPosting.candidate.Document', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.jobPosting.Candidate'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE_DOCUMENT
        },

        fields : [
            {
                name : 'jobPostingCandidateId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },

            {
                name : 'documentTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE
            },
            {
                name : 'fileName',
                type : 'string'
            },
            {
                name : 'contentType',
                type : 'string'
            },
            {
                name : 'uploadDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'size',
                type : 'integer',
                persist : false
            },
            {
                name : 'formId',
                type : 'integer'
            },
            {
                name : 'isResponded',
                type : 'boolean'
            },
            {
                name : 'webformId',
                type : 'integer'
            }
        ],

        hasOne : [
            {
                model : 'employer.jobPosting.Candidate',
                name : 'jobPostingCandidate',
                associationKey : 'jobPostingCandidate'
            }
        ]
    };
});
