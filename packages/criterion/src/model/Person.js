Ext.define('criterion.model.Person', function() {

    var Api = criterion.consts.Api,
        API = Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.proxy.Rest',
            'criterion.model.CustomData'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON
        },

        idProperty : 'personId',

        metaName : 'person',

        fields : [
            {
                name : 'nationalIdentifier',
                type : 'string',
                allowNull : true
            },
            {
                name : 'firstName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'middleName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'formerName',
                type : 'string'
            },
            {
                name : 'nickName',
                type : 'string'
            },
            {
                name : 'email',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'personalEmail',
                type : 'string'
            },
            {
                name : 'workPhone',
                type : 'string'
            },
            {
                name : 'homePhone',
                type : 'string'
            },
            {
                name : 'mobilePhone',
                type : 'string'
            },
            {
                name : 'additionalPhoneNumber',
                type : 'string'
            },
            {
                name : 'workPhoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'homePhoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'mobilePhoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'additionalPhoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'prefixCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.SALUTATION
            },
            {
                name : 'prefixDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'prefixCd'
            },
            {
                name : 'suffixCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.GENERATION
            },
            {
                name : 'dateOfBirth',
                type : 'date',
                dateFormat : Api.DATE_FORMAT
            },
            {
                name : 'dateOfDeath',
                type : 'date',
                dateFormat : Api.DATE_FORMAT
            },
            {
                name : 'genderCd',
                type : 'criterion_codedata',
                codeDataId : DICT.GENDER
            },
            {
                name : 'maritalStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.MARITAL_STATUS
            },
            {
                name : 'ethnicityCd',
                type : 'criterion_codedata',
                codeDataId : DICT.ETHNICITY
            },
            {
                name : 'primaryLanguageCd',
                type : 'criterion_codedata',
                codeDataId : DICT.LANGUAGE
            },
            {
                name : 'citizenshipCountryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'dualCitizenshipCountryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'militaryStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.MILITARY_STATUS
            },
            {
                name : 'lastMilitarySeparation',
                type : 'date',
                dateFormat : Api.DATE_FORMAT
            },
            {
                name : 'isTobaccoUser',
                type : 'boolean'
            },
            {
                name : 'isHandicapped',
                type : 'boolean'
            },
            {
                name : 'isSubstanceAbuse',
                type : 'boolean'
            },
            {
                name : 'disabilityCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DISABILITY
            },
            {
                name : 'positionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_TYPE
            },
            {
                name : 'fullName',
                persist: false,
                calculate : function(data) {
                    var middleName = data.middleName;

                    return data.firstName + ' ' + (middleName && middleName + ' ') + data.lastName;
                }
            },
            {
                name : 'identifier',
                allowNull : true,
                type : 'string'
            },
            {
                name : 'workflowLogId',
                allowNull : true,
                type : 'int'
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'customFields',
                type : 'auto'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.WorkflowLog',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ]
    };

});
