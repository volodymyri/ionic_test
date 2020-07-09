Ext.define('criterion.model.ReviewScale', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.reviewScale.Detail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_SCALE
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'ratingLimit',
                type : 'integer'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.reviewScale.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
