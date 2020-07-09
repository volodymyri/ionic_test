Ext.define('criterion.model.app.CustomSettings', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'label',
                type : 'string'
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'mandatory',
                type : 'boolean'
            },
            {
                name : 'value',
                type : 'auto',
                serialize : function(value) {
                    if (Ext.isDate(value)) {
                        return Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT);
                    } else {
                        return value;
                    }
                }
            }
        ]
    };
});
