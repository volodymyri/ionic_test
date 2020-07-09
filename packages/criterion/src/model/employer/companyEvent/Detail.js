Ext.define('criterion.model.employer.companyEvent.Detail', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'companyEventId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'companyEventName',
                type : 'string',
                persist : false
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'canPostEss',
                type : 'boolean'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COMPANY_EVENT_DETAIL
        }
    };
});
