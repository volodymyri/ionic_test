// candidate_documents
Ext.define('criterion.store.employer.jobPosting.candidate.Documents', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.employer_jobposting_candidate_documents',

        model : 'criterion.model.employer.jobPosting.candidate.Document',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE_DOCUMENT
        },

        autoLoad : false,
        autoSync : false
    };
});
