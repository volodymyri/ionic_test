Ext.define('criterion.model.dashboard.Color', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'color',
                type : 'string',
                defaultValue : '#FF0000'
            }
        ]
    };

});