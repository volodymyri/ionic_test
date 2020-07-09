Ext.define('criterion.model.dashboard.InfoBox', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dashboard.infoBox.Video'
        ],

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'text',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.dashboard.infoBox.Video',
                name : 'videos',
                associationKey : 'videos'
            }
        ]
    };

});
