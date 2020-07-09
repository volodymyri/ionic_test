Ext.define('criterion.model.dashboard.Value', function() {

    return {
        extend : 'criterion.model.dashboard.AbstractValue',

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'revenue',
                type : 'float'
            },
            {
                name : 'employerId',
                type : 'integer'
            }
        ]
    };

});
