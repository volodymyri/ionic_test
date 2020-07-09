Ext.define('criterion.model.employee.timesheet.vertical.SplittedTask', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'assignmentId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taskId',
                type : 'integer'
            },
            {
                name : 'customValue1',
                type : 'string'
            },
            {
                name : 'customValue2',
                type : 'string'
            },
            {
                name : 'customValue3',
                type : 'string'
            },
            {
                name : 'customValue4',
                type : 'string'
            },
            {
                name : 'hours',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'minutes',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taskHoursString',
                type : 'string',
                persist : false,
                depends : ['hours', 'minutes'],
                convert : function(value, record) {
                    var hours = record.get('hours'),
                        minutes = record.get('minutes'),
                        hoursString = '00:00';

                    if (hours || minutes) {
                        hoursString = Ext.String.leftPad(hours || 0, 2, '0') + ':' + Ext.String.leftPad(minutes || 0, 2, '0');
                    }

                    return hoursString;
                }
            }
        ]
    };
});
