Ext.define('criterion.model.employee.teamTimeOff.Plan', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'erPlanId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'planIsAccrualInDays',
                type : 'boolean'
            },
            {
                name : 'accrued',
                type : 'float'
            },
            {
                name : 'taken',
                type : 'float'
            },
            {
                name : 'planned',
                type : 'float'
            },
            {
                name : 'balance',
                type : 'float'
            },
            {
                name : 'netCarryover',
                type : 'float'
            },
            {
                name : 'timeOffTypes'
            }
        ]
    };
});
