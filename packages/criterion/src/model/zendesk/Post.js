Ext.define('criterion.model.zendesk.Post', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        ZEN_DESC_SUGGESTION_STATUS = criterion.Consts.ZEN_DESC_SUGGESTION_STATUS;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            'url',
            {
                name : 'title',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'details',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'topic_id',
                type : 'int',
                defaultValue : criterion.consts.Help.HELP_CENTER_SUGGESTION_TOPIC_ID
            },
            'status',
            {
                name : 'statusText',
                calculate : function(data) {
                    return (data.status && ZEN_DESC_SUGGESTION_STATUS[data.status]) || i18n.gettext('No Status');
                }
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.ZENDESK_POST,

            reader : {
                rootProperty : 'post'
            },

            writer : {
                rootProperty : 'post'
            }
        }
    };

});
