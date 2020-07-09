Ext.define('criterion.model.zendesk.Request', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            'url',
            {
                name : 'created_at',
                type : 'date',
                dateFormat : criterion.consts.Api.ZENDESK_DATE_TIME_FORMAT
            },
            {
                name : 'updated_at',
                type : 'date',
                dateFormat : criterion.consts.Api.ZENDESK_DATE_TIME_FORMAT
            },
            {
                name : 'due_at',
                type : 'date',
                dateFormat : criterion.consts.Api.ZENDESK_DATE_TIME_FORMAT
            },
            {
                name : 'subject',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                validators : [VALIDATOR.NON_EMPTY]
            },
            'status',
            'priority',
            'type'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.ZENDESK_REQUEST,

            reader : {
                rootProperty : 'request'
            },

            writer : {
                rootProperty : 'request'
            }
        }
    };

});
