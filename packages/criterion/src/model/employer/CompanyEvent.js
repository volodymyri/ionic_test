Ext.define('criterion.model.employer.CompanyEvent', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.companyEvent.Detail'
        ],

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'year',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'eventCount',
                type : 'integer',
                persist : false
            },
            {
                name : 'canPostEss',
                type : 'boolean'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.companyEvent.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COMPANY_EVENT
        }
    };
});
