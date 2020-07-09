Ext.define('criterion.model.person.PriorEmployment', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.person.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_PRIOR_EMPLOYMENT
        },

        fields : [
            // prior_employer_1
            {
                name : 'company',
                type : 'string'
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'phone',
                type : 'string'
            },
            {
                name : 'phoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'address1',
                type : 'string'
            },
            {
                name : 'address2',
                type : 'string'
            },
            {
                name : 'city',
                type : 'string'
            },
            {
                name : 'stateCd',
                type : 'criterion_codedata',
                codeDataId : DICT.STATE
            },
            {
                name : 'countryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'website',
                type : 'string'
            },
            {
                name : 'supervisor',
                type : 'string'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },

            // prior_employer_2
            {
                name : 'startingSalary',
                type : 'number'
            },
            {
                name : 'startingSalaryRateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT
            },
            {
                name : 'endingSalary',
                type : 'number'
            },
            {
                name : 'endingSalaryRateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT
            },
            {
                name : 'permissionToContact',
                type : 'boolean'
            },
            {
                name : 'reasonForLeaving',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            }
        ]
    };

});

