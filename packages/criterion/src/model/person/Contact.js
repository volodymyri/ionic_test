Ext.define('criterion.model.person.Contact', function() {

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
            url : API.PERSON_CONTACT
        },

        metaName : 'person_contact',

        fields : [
            {
                name : 'dateActive',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'dateOfBirth',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
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
                name : 'nickName',
                type : 'string'
            },
            {
                name : 'genderCd',
                type : 'criterion_codedata',
                codeDataId : DICT.GENDER,
                validators : [VALIDATOR.NON_EMPTY],
                allowNull : true
            },
            {
                name : 'relationshipTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RELATIONSHIP_TYPE,
                validators : [VALIDATOR.NON_EMPTY],
                allowNull : true
            },
            {
                name : 'disabilityCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DISABILITY,
                allowNull : true
            },
            {
                name : 'studentStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.STUDENT_STATUS,
                allowNull : true
            },
            {
                name : 'educationEndDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'schoolName',
                type : 'string'
            },
            {
                name : 'isEmergency',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isDependent',
                type : 'boolean',
                defaultValue : true
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
                name : 'stateCd',
                type : 'criterion_codedata',
                codeDataId : DICT.STATE
            },
            {
                name : 'countryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'countryCode',
                type : 'criterion_codedatavalue',
                referenceField : 'countryCd',
                dataProperty : 'attribute1'
            },
            {
                name : 'postalCode',
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
                name : 'email',
                type : 'string'
            },
            {
                name : 'prefixCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALUTATION,
                allowBlank : true
            },
            {
                name : 'suffixCd',
                type : 'criterion_codedata',
                codeDataId : DICT.GENERATION,
                allowBlank : true
            },
            {
                name : 'fullName',
                calculate : function(data) {
                    let middleName = data.middleName;

                    return data.firstName + ' ' + (middleName && middleName + ' ') + data.lastName;
                }
            },
            {
                name : 'phone',
                calculate : function(data) {
                    return data.workPhoneInternational || data.homePhoneInternational || data.mobilePhoneInternational
                }
            },
            {
                name : 'nationalIdentifier',
                type : 'string'
            },

            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
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
                dataProperty : 'description',
                persist : false
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                persist : false,
                dataProperty : 'code'
            },

            // "virtual" fields needed to support custom value change via workflow
            {
                name : 'customValues',
                allowNull : true
            },
            {
                name : 'removedCustomValues',
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.workflow.transaction.Log',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],

        /**
         * Prepares custom values for update via workflow.
         *
         * @param {Object} data
         * @param {criterion.store.customField.Values} data.modifiedCustomValues
         * @param {criterion.store.customField.Values} data.removedCustomValues
         */
        setCustomValues : function(data) {
            let modified = [], removed = [];

            if (data.modifiedCustomValues.length) {
                Ext.Array.each(data.modifiedCustomValues, function(r) {
                    modified.push(r.getData({serialize : true}));
                });
                this.set('customValues', modified);
            }

            if (data.removedCustomValues.length) {
                Ext.Array.each(data.removedCustomValues, function(r) {
                    removed.push(r.getData({serialize : true}));
                });
                this.set('removedCustomValues', removed);
            }
        }
    };
});
