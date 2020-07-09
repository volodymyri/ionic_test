Ext.define('criterion.model.employer.shift.occurrence.startData.Date', function() {

    return {

        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            }
        ]
    };
});
