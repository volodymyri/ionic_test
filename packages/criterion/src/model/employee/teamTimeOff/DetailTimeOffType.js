Ext.define('criterion.model.employee.teamTimeOff.DetailTimeOffType', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'color',
                type : 'string'
            },
            {
                name : 'typeDescription',
                type : 'string'
            },
            {
                name : 'total',
                type : 'float'
            },
            {
                name : 'start',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'end',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'isFullDay',
                type : 'boolean'
            }
        ]
    };
});
