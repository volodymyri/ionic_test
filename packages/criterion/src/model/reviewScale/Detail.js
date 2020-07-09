Ext.define('criterion.model.reviewScale.Detail', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_SCALE_DETAIL
        },

        fields : [
            {
                name : 'reviewScaleId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rating',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY],
                defaultValue : criterion.Consts.REVIEW_SCALE_RATING.LOWEST
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            }
        ]
    };
});
