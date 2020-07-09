Ext.define('criterion.model.person.Address', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.person.Abstract',

        metaName : 'person_address',

        fields : [
            {
                name : 'addressLocationCd',
                type : 'criterion_codedata',
                codeDataId : DICT.ADDRESS_LOCATION,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'countryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COUNTRY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'countryCode',
                type : 'criterion_codedatavalue',
                referenceField : 'countryCd',
                dataProperty : 'attribute1'
            },
            {
                name : 'geocode',
                type : 'string',
                allowNull : true,
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'schdist',
                type : 'string'
            },
            {
                name : 'schdistName',
                type : 'string'
            },
            {
                name : 'address1',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY],
                metaName : 'address_1'
            },
            {
                name : 'address2',
                type : 'string',
                metaName : 'address_2'
            },
            {
                name : 'city',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'stateCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.STATE
            },
            {
                name : 'postalCode',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isMailingAddress',
                type : 'boolean'
            },
            {
                name : 'isPrimary',
                defaultValue : true,
                type : 'boolean'
            },
            {
                name : 'county',
                type : 'string'
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.WorkflowLog',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_ADDRESS
        }
    };

});
