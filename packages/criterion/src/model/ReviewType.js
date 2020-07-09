Ext.define('criterion.model.ReviewType', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'code',
                type : 'string'
            }
        ]
    };
});
