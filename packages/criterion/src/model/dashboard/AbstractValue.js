Ext.define('criterion.model.dashboard.AbstractValue', function() {

    return {
        extend : 'criterion.model.dashboard.Abstract',

        fields : [
            {
                name : 'metric_id',
                type : 'integer',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'metric',
                persist : false
            }
        ]
    };

});
