Ext.define('criterion.model.Candidate', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE
        },

        requires : [
            'criterion.model.candidate.Education',
            'criterion.model.candidate.Experience',
            'criterion.model.candidate.Award',
            'criterion.model.candidate.Certification',
            'criterion.model.candidate.Skill'
        ],

        fields : [
            {
                name : 'firstName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'lastName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'middleName',
                type : 'string'
            },
            {
                name : 'email',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'location',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'countryCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'countryDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'countryCd',
                dataProperty : 'description',
                depends : 'countryCd'
            },
            {
                name : 'address1',
                type : 'string'
            },
            {
                name : 'address2',
                type : 'string'
            },
            {
                name : 'city',
                type : 'string'
            },
            {
                type : 'criterion_codedata',
                name : 'stateCd',
                allowNull : true,
                codeDataId : DICT.STATE
            },
            {
                name : 'stateDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'stateCd',
                dataProperty : 'description',
                depends : 'stateCd'
            },
            {
                name : 'postalCode',
                type : 'string'
            },
            {
                name : 'website2',
                type : 'string'
            },
            {
                name : 'website1',
                type : 'string'
            },
            {
                name : 'hasResume',
                type : 'boolean'
            },
            {
                name : 'isPdfResume',
                type : 'boolean'
            },
            {
                name : 'isMSOResume',
                type : 'boolean',
                persist : false
            },
            {
                name : 'resumeURL',
                type : 'string',
                persist : false
            },
            {
                name : 'hasCoverLetter',
                type : 'boolean'
            },
            {
                name : 'isPdfCoverLetter',
                type : 'boolean'
            },
            {
                name : 'isMSOCoverLetter',
                type : 'boolean',
                persist : false
            },
            {
                name : 'coverLetterURL',
                type : 'string',
                persist : false
            },
            {
                name : 'homePhone',
                type : 'string'
            },
            {
                name : 'homePhoneUS',
                type : 'string',
                persist : false
            },
            {
                name : 'mobilePhone',
                type : 'string'
            },
            {
                name : 'mobilePhoneUS',
                type : 'string',
                persist : false
            },
            {
                name : 'workAuthorization',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'candidateRef',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'candidateStatusCd',
                type : 'criterion_codedata',
                codeDataId : API.CANDIDATE_STATUS,
                persist : false
            },
            {
                name : 'candidateStatus',
                type : 'criterion_codedatavalue',
                referenceField : 'candidateStatusCd'
            },
            {
                name : 'ssn',
                type : 'string'
            },
            {
                name : 'dateOfBirth',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'genderCd',
                type : 'criterion_codedata',
                codeDataId : DICT.GENDER,
                allowNull : true
            },
            {
                name : 'ethnicityCd',
                type : 'criterion_codedata',
                codeDataId : DICT.ETHNICITY,
                allowNull : true
            },
            {
                name : 'militaryStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.MILITARY_STATUS
            },
            {
                name : 'disabilityCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DISABILITY,
                allowNull : true
            },
            {
                name : 'appliedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.candidate.Education',
                name : 'educations',
                associationKey : 'educations'
            },
            {
                model : 'criterion.model.candidate.Experience',
                name : 'experiences',
                associationKey : 'experiences'
            },
            {
                model : 'criterion.model.candidate.Award',
                name : 'awards',
                associationKey : 'awards'
            },


            {
                model : 'criterion.model.candidate.Skill',
                name : 'skills',
                associationKey : 'skills'
            },
            {
                model : 'criterion.model.candidate.Certification',
                name : 'certifications',
                associationKey : 'certifications'
            }
        ]
    };
});
