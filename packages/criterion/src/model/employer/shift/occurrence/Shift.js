Ext.define('criterion.model.employer.shift.occurrence.Shift', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.shift.occurrence.Employee'
        ],

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'shiftGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                persist : false
            },
            {
                name : 'sequence',
                type : 'integer',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.shift.occurrence.Employee',
                name : 'employees',
                associationKey : 'employees'
            }
        ]
    };
});
