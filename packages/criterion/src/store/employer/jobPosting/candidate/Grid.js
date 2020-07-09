Ext.define('criterion.store.employer.jobPosting.candidates.Grid', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_job_posting_candidates_grid',

        model : 'criterion.model.employer.jobPosting.candidate.Grid',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_GRID
        }
    };
});
