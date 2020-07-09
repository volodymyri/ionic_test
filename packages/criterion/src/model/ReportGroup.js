Ext.define('criterion.model.ReportGroup', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT_GROUP
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'memorized',
                type : 'boolean'
            }
        ]
    };
});
