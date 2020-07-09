Ext.define('criterion.store.employer.JobPostings', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employer_job_postings',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.JobPosting',

        autoSync : false,
        autoLoad : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING
        }
    };
});