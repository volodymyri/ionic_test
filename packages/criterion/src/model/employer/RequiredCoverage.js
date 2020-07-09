Ext.define('criterion.model.employer.RequiredCoverage', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_REQUIRED_COVERAGE
        },

        fields : [
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'areaId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'positionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'endTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'requiredNum',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'locationName',
                type : 'string',
                persist : false
            },
            {
                name : 'areaName',
                type : 'string',
                persist : false
            },
            {
                name : 'positionTitle',
                type : 'string',
                persist : false
            }
        ]
    };
});
