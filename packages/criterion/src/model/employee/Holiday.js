Ext.define('criterion.model.employee.Holiday', function() {

    return {
        extend : 'Ext.data.Model',

        fields : [
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };
});
