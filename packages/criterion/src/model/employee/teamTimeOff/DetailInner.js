Ext.define('criterion.model.employee.teamTimeOff.DetailInner', function() {

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.teamTimeOff.DetailTimeOffType'
        ],

        proxy : {
            type : 'memory'
        },

        idProperty : 'date',

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.teamTimeOff.DetailTimeOffType',
                name : 'timeOffTypes',
                associationKey : 'timeOffTypes'
            }
        ]
    };
});
