Ext.define('criterion.model.dashboard.infoBox.Video', function() {

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'infoBoxId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            }
        ]
    };
});
