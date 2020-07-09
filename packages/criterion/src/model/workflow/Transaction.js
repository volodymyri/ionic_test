Ext.define('criterion.model.workflow.Transaction', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.workflow.Step'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_TRANSACTION
        },

        fields : [
            {
                name : 'initiator',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.workflow.Step',
                name : 'steps',
                associationKey : 'steps'
            }
        ]
    };
});
