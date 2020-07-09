Ext.define('criterion.model.searchPositions.ByPositionPerson', function() {

    return {
        extend : 'criterion.model.Abstract',

        idProperty : 'positionId',

        fields : [
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'person',
                type : 'string'
            },
            {
                name : 'combined',
                type : 'string',

                convert : function(newValue, model) {
                    return model.get('title') + ' (' + model.get('person') + ')';
                }
            }
        ]
    };
});
