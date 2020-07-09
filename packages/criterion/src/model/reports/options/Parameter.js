Ext.define('criterion.model.reports.options.Parameter', function() {

    return {
        extend : 'criterion.model.Abstract',

        idProperty : 'name',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'label',
                type : 'string'
            },
            {
                name : 'value',
                type : 'auto'
            },
            {
                name : 'mandatory',
                type : 'boolean'
            },
            {
                name : 'valueType',
                type : 'string'
            },
            {
                name : 'hidden',
                type : 'boolean'
            },
            {
                name : 'isTransferParameter',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'hasPredefinedValues',
                type : 'boolean',
                defaultValue : false,
                persist : false
            },
            {
                name : 'paramValues',
                persist : false
            },
            {
                name : 'textHelper',
                type : 'string',
                persist : false
            },
            {
                name : 'defaultValue',
                type : 'string',
                persist : false
            },
            {
                name : 'orderBy',
                type : 'string',
                persist : false
            },
            {
                name : 'remoteOrderByProp',
                type : 'string',
                persist : false
            },
            {
                name : 'remoteOrderByDir',
                type : 'string',
                persist : false
            }
        ]
    };

});
