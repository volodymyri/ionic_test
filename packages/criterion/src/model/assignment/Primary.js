Ext.define('criterion.model.assignment.Primary', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Assignment',

        proxy : {
            type : 'criterion_rest',

            url : API.ASSIGNMENT_PRIMARY,

            api: {
                read: API.ASSIGNMENT_PRIMARY,
                create: API.ASSIGNMENT,
                update: API.ASSIGNMENT,
                destroy: API.ASSIGNMENT
            },

            appendId : false
        },

        hasOne : [ // doesn't inherit from base class properly!
            {
                model : 'criterion.model.Position',
                name : 'position',
                associationKey : 'position'
            },
            {
                model : 'criterion.model.workflow.transaction.Log',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],

        hasMany : [ // doesn't inherit from base class properly!
            {
                model : 'criterion.model.assignment.Detail',
                name : 'assignmentDetails',
                associationKey : 'assignmentDetails'
            }
        ]
    };
});