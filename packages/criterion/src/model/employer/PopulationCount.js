Ext.define('criterion.model.employer.PopulationCount', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POPULATION_COUNT
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
                name : 'count',
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
            }
        ]
    };
});
