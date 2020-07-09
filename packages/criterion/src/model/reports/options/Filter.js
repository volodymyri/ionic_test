Ext.define('criterion.model.reports.options.Filter', function () {

    return {
        extend : 'criterion.model.Abstract',

        idProperty: 'alias',

        fields : [
            {
                name : 'table'
            },
            {
                name : 'alias',
                mapping : 'table.alias'
            },
            {
                name : 'fields',
                mapping : 'table.fields'
            }
        ]
    };

});
