Ext.define('criterion.store.community.BadgesEarned', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_community_badges_earned',

        model : 'criterion.model.community.BadgeEarned',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_BADGE_EARNED
        },

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
