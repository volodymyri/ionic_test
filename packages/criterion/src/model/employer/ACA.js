Ext.define('criterion.model.employer.ACA', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.aca.Month',
            'criterion.model.employer.aca.Member'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ACA
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxYear',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'eligibilityCertifications',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'mecIndicator',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'ftEmployeeCount',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'totalEmployeeCount',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'groupIndicator',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reliefIndicator',
                type : 'string'
            },
            {
                name : 'contactFirstName',
                type : 'string'
            },
            {
                name : 'contactLastName',
                type : 'string'
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'contactPhone',
                type : 'string'
            },
            {
                name : 'contactPhoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'transmitDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.aca.Month',
                name : 'months',
                associationKey : 'months'
            },
            {
                model : 'criterion.model.employer.aca.Member',
                name : 'aleMembers',
                associationKey : 'aleMembers'
            }
        ]
    };
});
