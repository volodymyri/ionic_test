Ext.define('criterion.model.candidate.Experience', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_EXPERIENCE
        },

        fields : [
            {
                name : 'candidateId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'company',
                type : 'string'
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'location',
                type : 'string',
                allowNull : true
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
            {
                name : 'description',
                type : 'string'
            }
        ]
    };
});
