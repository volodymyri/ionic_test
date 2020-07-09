Ext.define('criterion.model.community.BadgeEarned', function() {

    return {
        extend : 'criterion.model.community.Badge',

        fields : [
            {
                name : 'count',
                type : 'integer',
                persist : false
            }
        ]
    };
});
