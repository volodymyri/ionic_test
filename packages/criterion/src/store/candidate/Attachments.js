Ext.define('criterion.store.candidate.Attachments', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.candidate_attachments',

        model : 'criterion.model.candidate.Attachment',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_ATTACHMENT
        }
    };
});
