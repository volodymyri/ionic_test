Ext.define('criterion.model.candidate.Award', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_AWARD
        },

        fields : [
            {
                name : 'candidateId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'awardDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };
});
