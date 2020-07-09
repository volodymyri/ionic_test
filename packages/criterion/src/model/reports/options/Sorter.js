Ext.define('criterion.model.reports.options.Sorter', function () {

    return {
        extend : 'criterion.model.Abstract',

        idProperty: 'key',

        fields : [
            {
                name : 'fieldName',
                type : 'string',
                allowNull: true
            },
            {
                name : 'key',
                type : 'string'
            },
            {
                name : 'selected',
                type : 'boolean',
                defaultValue : false
            }
        ]
    };

});
