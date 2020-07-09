Ext.define('criterion.model.person.Certification', function () {

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
            url : API.PERSON_CERTIFICATION
        },

        fields : [
            {
                name : 'certificationId',
                type : 'int',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'issuedBy',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'description',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'issueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'expiryDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'certificationName',
                type : 'string',
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
