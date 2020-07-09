Ext.define('criterion.model.employer.jobPosting.candidate.Note', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE_NOTES
        },

        fields : [
            {
                name : 'jobPostingCandidateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'candidateNotesCd',
                type : 'criterion_codedata',
                codeDataId : DICT.CANDIDATE_NOTES,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'notes',
                type : 'string'
            },
            {
                name : 'notesDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },

            {
                name : 'notesDateDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'notesDateTime',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            }
        ]
    };
});
