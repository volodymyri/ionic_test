Ext.define('criterion.model.employer.EssWidgets', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ESS_WIDGETS
        },

        fields : [
            {
                name : 'widgets',
                type : 'integer'
            }
        ]
    };
});
