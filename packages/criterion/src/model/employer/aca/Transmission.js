Ext.define('criterion.model.employer.aca.Transmission', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ACA_TRANSMISSION
        },

        fields : [
            {
                name : 'acaId',
                type : 'integer'
            },
            {
                name : 'formDataFileName',
                type : 'string'
            },
            {
                name : 'status',
                type : 'string'
            }
        ]
    };
});
