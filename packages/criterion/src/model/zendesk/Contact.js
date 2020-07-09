Ext.define('criterion.model.zendesk.Contact', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'title',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'message',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.ZENDESK_CONTACT_US
        }
    };

});
