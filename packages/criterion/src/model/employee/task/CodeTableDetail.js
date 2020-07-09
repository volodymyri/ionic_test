Ext.define('criterion.model.employee.task.CodeTableDetail', function() {

    return {

        extend : 'criterion.model.Abstract',

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'codeTableId',
                type : 'integer'
            },
            {
                name : 'value',
                type : 'string'
            }
        ]
    };

});
