Ext.define('criterion.model.employer.jobPosting.candidate.Grid', function() {

    return {

        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_GRID
        },

        fields : [
            {
                name : 'candidateId',
                type : 'integer'
            },
            {
                name : 'appliedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'candidateStatusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.CANDIDATE_STATUS
            },
            {
                name : 'candidateStatus',
                type : 'criterion_codedatavalue',
                referenceField : 'candidateStatusCd'
            },
            {
                name : 'rating',
                type : 'float'
            }
        ]
    };
});
