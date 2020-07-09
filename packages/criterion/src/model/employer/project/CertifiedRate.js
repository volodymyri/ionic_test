Ext.define('criterion.model.employer.project.CertifiedRate', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'projectId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'certifiedRateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
