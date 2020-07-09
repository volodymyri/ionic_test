Ext.define('criterion.store.employer.jobPosting.candidate.Notes', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_job_posting_candidate_notes',

        model : 'criterion.model.employer.jobPosting.candidate.Note',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_NOTES
        }
    };
});
