Ext.define('criterion.store.publishSite.JobPosting', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_publish_site_job_posting',

        model : 'criterion.model.publishSite.JobPosting',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PUBLISH_SITE_JOB_POSTING
        }
    };
});
