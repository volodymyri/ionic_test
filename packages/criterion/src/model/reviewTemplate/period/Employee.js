Ext.define('criterion.model.reviewTemplate.period.Employee', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE_PERIOD_EMPLOYEE
        },

        requires : [
            'criterion.model.ReviewType',
            'criterion.model.review360.SubReview'
        ],

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'employeeName',
                type : 'string'
            },
            {
                name : 'reviewTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REVIEW_TYPE,
                allowNull : true
            },
            {
                name : 'reviewType',
                type : 'criterion_codedatavalue',
                depends : 'reviewTypeCd',
                referenceField : 'reviewTypeCd',
                dataProperty : 'description'
            },
            {
                name : 'is360',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isCustomFrequency',
                type : 'boolean',
                persist : false
            },
            {
                name : 'reviewerName',
                type : 'string'
            },
            {
                name : 'periodStart',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'periodEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reviewDeadline',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'status',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.ReviewType',
                name : 'reviewTypes',
                associationKey : 'reviewTypes'
            },
            {
                model : 'criterion.model.review360.SubReview',
                name : 'reviewerDetails',
                associationKey : 'reviewerDetails'
            }
        ]
    };
});
