Ext.define('criterion.model.employee.orgChart.OpenPosition', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        },

        fields : [
            {
                name : 'positionTitle',
                type : 'string'
            },
            {
                name : 'openFTE',
                type : 'integer'
            }
        ]
    };
});