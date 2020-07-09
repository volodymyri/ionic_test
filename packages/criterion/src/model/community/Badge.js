Ext.define('criterion.model.community.Badge', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_BADGE
        },

        fields : [
            {
                name : 'file',
                type : 'auto'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'imageUrl',
                convert : function(value, record) {
                    return record.phantom ? null : criterion.Api.getSecureResourceUrl(API.COMMUNITY_BADGE_IMAGE + '/' + record.get('id'))
                },
                persist : false
            }
        ]
    };
});
