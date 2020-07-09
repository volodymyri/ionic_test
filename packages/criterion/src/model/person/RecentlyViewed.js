Ext.define('criterion.model.person.RecentlyViewed', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'count',
                type : 'integer'
            },
            {
                name : 'last',
                type : 'integer'
            }
        ]
    };

});
