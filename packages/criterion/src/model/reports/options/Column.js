Ext.define('criterion.model.reports.options.Column', function () {

    return {
        extend : 'criterion.model.Abstract',

        idProperty: 'fieldName',

        fields : [
            {
                name : 'fieldName',
                type : 'string'
            },
            {
                name : 'displayName',
                type : 'string'
            }
        ]
    };

});
