Ext.define('criterion.store.employer.jobPosting.Candidates', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_job_posting_candidates',

        model : 'criterion.model.employer.jobPosting.Candidate',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE
        }
    };
});
