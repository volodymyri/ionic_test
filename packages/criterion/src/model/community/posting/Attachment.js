Ext.define('criterion.model.community.posting.Attachment', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_POSTING_ATTACHMENT
        },

        fields : [
            {
                name : 'communityPostingId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'fileName',
                type : 'string',
                persist : false
            },
            {
                name : 'downloadUrl',
                convert : function(value, record) {
                    return Ext.util.Format.format(API.COMMUNITY_POSTING_ATTACHMENT_DOWNLOAD, record.get('id'))
                },
                persist : false
            }
        ]
    };
});
