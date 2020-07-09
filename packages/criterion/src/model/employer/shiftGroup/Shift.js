Ext.define('criterion.model.employer.shiftGroup.Shift', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.shiftGroup.ShiftSchedule'
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
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'sequence',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },

            ...(Ext.Array.map(criterion.Utils.range(0, 6), day => ({
                name : `day_${day}`,
                persist : false
            })))
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.shiftGroup.ShiftSchedule',
                name : 'shiftSchedule',
                associationKey : 'shiftSchedule'
            }
        ],

        processSchedule() {
            let days = {},
                shiftSchedule = this.shiftSchedule(),
                changeMark = [];

            Ext.Array.each(criterion.Utils.range(1, 7), i => days[i] = []);

            shiftSchedule.each(shiftSchedule => {
                let day = shiftSchedule.get('day'),
                    startTime = shiftSchedule.get('startTime');

                days[day].push({
                    start : Ext.Date.format(Ext.Date.parse(Ext.Date.format(startTime, criterion.consts.Api.TIME_FORMAT), criterion.consts.Api.TIME_FORMAT), criterion.consts.Api.TIMESTAMP),
                    val : Ext.String.format('{0} to {1}', Ext.Date.format(startTime, criterion.consts.Api.SHOW_TIME_FORMAT), Ext.Date.format(shiftSchedule.get('endTime'), criterion.consts.Api.SHOW_TIME_FORMAT))
                });
            });

            Ext.Object.each(days, (index, schedule) => {
                Ext.Array.sort(schedule, (a, b) => {
                    a = a.start;
                    b = b.start;

                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    }
                    return 0;
                });

                let dayVal = Ext.Array.map(schedule, resArr => resArr.val).join('<br />');

                changeMark.push(`${index}-${dayVal}`);

                this.set('day_' + (index - 1), dayVal);
            });
        }
    };
});
