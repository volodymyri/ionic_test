Ext.define('criterion.model.employee.Birthday', function() {

    return {
        extend : 'Ext.data.Model',

        fields : [
            {
                name : 'name',
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
