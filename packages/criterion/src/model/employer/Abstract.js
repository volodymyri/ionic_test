Ext.define('criterion.model.employer.Abstract', function() {

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employerId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            }
        ]
    };
});
