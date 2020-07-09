Ext.define('criterion.model.review360.Status', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'reviewer',
                type : 'string'
            },
            {
                name : 'status',
                type : 'string'
            },
            {
                name : 'isComplete',
                type : 'boolean'
            }
        ]
    };
});
