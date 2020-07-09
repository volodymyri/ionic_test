Ext.define('criterion.model.PagingPageSize', function() {

    return {
        extend : 'Ext.data.Model',

        fields: [
            {
                name: 'pagesize',
                type: 'int'
            }
        ]
    };
});
