Ext.define('criterion.model.reviewTemplate.Period', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.ReviewTemplate'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE_PERIOD
        },

        fields : [
            {
                name : 'reviewTemplateId',
                validators : [VALIDATOR.NON_EMPTY],
                type : 'integer'
            },
            {
                name : 'reviewTemplateName',
                convert : function(newValue, model) {
                    var reviewTemplate = model.getData({associated : true}).reviewTemplate;
                    return reviewTemplate ? reviewTemplate['name'] : null
                },
                persist : false
            },
            {
                name : 'name',
                validators : [VALIDATOR.NON_EMPTY],
                type : 'string'
            },
            {
                name : 'reviewType',
                validators : [VALIDATOR.NON_EMPTY],
                type : 'integer'
            },
            {
                name : 'anonymousType',
                type : 'integer'
            },
            {
                name : 'anonymousLevel',
                type : 'integer',
                defaultValue : 0
            },
            {
                name : 'isActive',
                validators : [VALIDATOR.NON_EMPTY],
                defaultValue : true,
                type : 'boolean'
            },
            {
                name : 'is360',
                validators : [VALIDATOR.NON_EMPTY],
                type : 'boolean'
            },
            {
                name : 'orgStructureCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.ORG_STRUCTURE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'frequencyCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.REVIEW_FREQUENCY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'frequencyCode',
                type : 'criterion_codedatavalue',
                dataProperty : 'code',
                referenceField : 'frequencyCd'
            },
            {
                name : 'duration',
                type : 'integer',
                validators : [
                    VALIDATOR.NON_EMPTY,
                    VALIDATOR.PREDEFINED_RANGE(1, 12)
                ]
            },

            {
                name : 'periodStart',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'periodEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewDeadline',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },

            {
                name : 'periodStartStr',
                type : 'string'
            },
            {
                name : 'reviewDateStr',
                type : 'string'
            },
            {
                name : 'reviewDeadlineStr',
                type : 'string'
            },

            {
                name : 'workflowId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'workflowTypeCd',
                type : 'criterion_codedata',
                persist : false, // for load dict
                codeDataId : DICT.WORKFLOW
            },
            {
                name : 'workflowName',
                type : 'string',
                persist : false
            },
            {
                name : 'workflowIsActive',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isAggregatedReview',
                type : 'boolean'
            },
            {
                name : 'isAggregatedOverallScoreDisplayed',
                type : 'boolean'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.ReviewTemplate',
                name : 'reviewTemplate',
                associationKey : 'reviewTemplate'
            }
        ]
    };
});
