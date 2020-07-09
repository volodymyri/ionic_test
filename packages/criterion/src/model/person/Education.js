Ext.define('criterion.model.person.Education', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.person.Abstract',

        requires : [
            'criterion.model.workflow.transaction.Log'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_EDUCATION
        },

        metaName : 'person_education',

        fields : [
            {
                name : 'schoolName',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'fieldOfStudy',
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
            {
                name : 'degreeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEGREE,
                allowNull : true
            },
            {
                name : 'additionalDegreeInformation',
                type : 'string'
            },
            {
                name : 'activities',
                type : 'string'
            },

            {
                name : 'canRecall',
                type : 'boolean',
                persist : false
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'workflowLogId',
                type : 'integer',
                allowNull : true,
                persist : false
            },
            {
                name : 'status',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'description'
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'code'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.workflow.transaction.Log',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ]
    };
});
