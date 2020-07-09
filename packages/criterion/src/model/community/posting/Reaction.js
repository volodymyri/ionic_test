Ext.define('criterion.model.community.posting.Reaction', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_POSTING_REACTION
        },

        fields : [
            {
                name : 'communityPostingId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isLiked',
                type : 'boolean'
            },
            {
                name : 'message',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'creationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'lastEditDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'authorName',
                type : 'string',
                persist : false
            },
            {
                name : 'personId',
                type : 'integer',
                persist : false
            },
            {
                name : 'authorPhotoUrl',
                depends : ['personId'],
                convert : function(value, record) {
                    return criterion.Api.getSecureResourceUrl(API.PERSON_PHOTO_THUMB + '/' + record.get('personId'))
                },
                persist : false
            }
        ]
    };
});
