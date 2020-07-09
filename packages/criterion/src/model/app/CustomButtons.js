Ext.define('criterion.model.app.CustomButtons', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'appId',
                type : 'integer'
            },
            {
                name : 'tableId',
                type : 'integer'
            },
            {
                name : 'buttonCd',
                type : 'integer'
            },
            {
                name : 'buttonName',
                type : 'string'
            }
        ]
    };
});
