Ext.define('criterion.model.reports.options.TableSettings', function () {

    return {
        extend : 'criterion.model.Abstract',

        idProperty: 'alias',

        fields : [
            {
                name : 'tableAlias',
                type : 'string'
            },
            {
                name : 'displayName',
                type : 'string'
            }
        ]
    };

});
