Ext.define('criterion.store.employer.jobPosting.candidate.interview.Reviews', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_job_posting_candidate_interview_reviews',

        model : 'criterion.model.employer.jobPosting.candidate.interview.Review',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_REVIEW
        }
    };
});
