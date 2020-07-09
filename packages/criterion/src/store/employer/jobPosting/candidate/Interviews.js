Ext.define('criterion.store.employer.jobPosting.candidate.Interviews', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_job_posting_candidate_interviews',

        model : 'criterion.model.employer.jobPosting.candidate.Interview',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW
        }
    };
});
