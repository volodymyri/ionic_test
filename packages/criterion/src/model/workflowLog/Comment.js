Ext.define('criterion.model.workflowLog.Comment', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'commentator',
                type : 'string'
            },
            {
                name : 'comment',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'text',
                type : 'string'
            }
        ]
    };
});
