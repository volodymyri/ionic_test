Ext.define('criterion.model.dashboard.subordinateTimesheet.DateHour', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'hours',
                type : 'float'
            }
        ]
    };

});
