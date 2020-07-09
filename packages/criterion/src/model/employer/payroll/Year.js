Ext.define('criterion.model.employer.payroll.Year', function() {

    return {
        extend : 'criterion.model.Abstract',

        idProperty : 'year',

        fields : [
            {
                name : 'year',
                type : 'integer'
            }
        ]
    };
});
