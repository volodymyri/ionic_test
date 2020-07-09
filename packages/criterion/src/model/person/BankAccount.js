Ext.define('criterion.model.person.BankAccount', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.person.Abstract',

        requires : [
            'criterion.model.workflow.transaction.Log'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_BANK_ACCOUNT
        },

        metaName : 'person_bank_account',

        fields : [
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'bankName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accountNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'depositOrder',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY, VALIDATOR.PREDEFINED_RANGE(criterion.Consts.DEPOSIT_ORDER.MIN, criterion.Consts.DEPOSIT_ORDER.MAX)]
            },
            {
                name : 'value',
                type : 'float'
            },
            {
                name : 'depositTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.DEPOSIT_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'depositTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'depositTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'depositTypeDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'depositTypeCd',
                dataProperty : 'description'
            },
            {
                name : 'routingNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accountTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.ACCOUNT_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },

            {
                name : 'workflowLogId',
                type : 'int',
                persist : false
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'status',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd'
            },
            {
                name : 'statusCode',
                type : 'string',
                persist : false
            },
            {
                name : 'paymentTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.PAYMENT_TYPE
            },
            {
                name : 'lastAccountUpdated',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'first',
                type : 'boolean'
            },
            {
                name : 'second',
                type : 'boolean'
            },
            {
                name : 'third',
                type : 'boolean'
            },
            {
                name : 'fourth',
                type : 'boolean'
            },
            {
                name : 'fifth',
                type : 'boolean'
            },
            {
                name : 'last',
                type : 'boolean'
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
