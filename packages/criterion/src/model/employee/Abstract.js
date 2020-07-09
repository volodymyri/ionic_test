Ext.define('criterion.model.employee.Abstract', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                allowBlank : false,
                validators : [
                    criterion.Consts.getValidator().PRESENCE
                ]
            }
        ]
    };
});
