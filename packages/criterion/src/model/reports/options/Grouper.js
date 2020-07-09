Ext.define('criterion.model.reports.options.Grouper', function () {

    return {
        extend : 'criterion.model.Abstract',

        idProperty: 'fieldName',

        fields : [
            {
                name : 'fieldName',
                type : 'string'
            },
            {
                name : 'key',
                type : 'string'
            },
            {
                name : 'displayName',
                type : 'string'
            },
            {
                name : 'dir',
                type : 'string'
            }
        ]
    };

});
