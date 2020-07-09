Ext.define('criterion.model.dataForm.FillableField', function() {

    return {
        extend : 'criterion.model.dataForm.Field',

        fields : [
            {
                name : 'dataformId',
                type : 'integer',
                reference : 'criterion.model.dataForm.FillableForm'
            },
            {
                name : 'value',
                type : 'string'
            }
        ]
    };
});
