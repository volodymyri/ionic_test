Ext.define('criterion.model.employer.shiftGroup.Certification', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'shiftGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'certificationId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                persist : false
            }
        ]
    };
});
