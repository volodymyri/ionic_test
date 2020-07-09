Ext.define('criterion.model.publishSite.JobPosting', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'jobPostingId',
                type : 'integer'
            },
            {
                name : 'publishSiteId',
                type : 'integer'
            },
            {
                name : 'publishDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PUBLISH_SITE_JOB_POSTING
        }
    };
});
