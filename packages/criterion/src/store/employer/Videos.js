Ext.define('criterion.store.employer.Videos', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_videos',

        model : 'criterion.model.employer.Video',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_VIDEO
        }
    };
});
