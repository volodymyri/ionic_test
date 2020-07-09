Ext.define('criterion.model.employer.GLSetup', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'appId'
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'transferId',
                type : 'integer',
                allowNull : true,
            },
            {
                name : 'parameter1',
                type : 'string'
            },
            {
                name : 'parameter2',
                type : 'string'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_GL_SETUP
        }
    };
});
