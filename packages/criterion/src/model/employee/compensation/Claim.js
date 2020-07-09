Ext.define('criterion.model.employee.compensation.Claim', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKER_COMPENSATION_CLAIM
        },

        fields : [
            {
                name : 'claimNumber',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'wcClaimTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WC_CLAIM_TYPE
            },
            {
                name : 'wcNatureOfInjuryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WC_NATURE_OF_INJURY
            },
            {
                name : 'reportedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'claimDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'injuryDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'closedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'restrictedTime',
                type : 'float'
            },
            {
                name : 'absentTime',
                type : 'float'
            },
            {
                name : 'litigated',
                type : 'boolean'
            },
            {
                name : 'injuryTime',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            },
            {
                name : 'wcTaskCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.WC_TASK
            },
            {
                name : 'wcBodyPartCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.WC_BODY_PART
            },
            {
                name : 'wcClaimActionCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.WC_CLAIM_ACTION
            },
            {
                name : 'wcClaimStatusCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.WC_CLAIM_STATUS
            },
            {
                name : 'wcToolCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.WC_TOOL
            },
            {
                name : 'wcLocationCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.WC_LOCATION
            }
        ]
    };
});
