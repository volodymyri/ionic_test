Ext.define('criterion.model.employer.aca.Member', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ACA_MEMBER
        },

        fields : [
            {
                name : 'acaId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'number',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
