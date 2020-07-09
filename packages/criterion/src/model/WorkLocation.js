Ext.define('criterion.model.WorkLocation', function() {

    var DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                type : 'criterion_codedata',
                name : 'locationTypeCd',
                allowNull : true,
                codeDataId : DICT.LOCATION_TYPE
            },
            {
                name : 'certifiedRateId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'overtimeCode',
                type : 'string',
                allowNull : true
            },
            {
                name : 'geocode',
                allowNull : true,
                type : 'string'
            },
            {
                name : 'schdist',
                type : 'string',
                allowNull : true
            },
            {
                name : 'address1',
                type : 'string',
                allowNull : true
            },
            {
                name : 'address2',
                type : 'string',
                allowNull : true
            },
            {
                name : 'city',
                allowNull : true,
                type : 'string'
            },
            {
                type : 'criterion_codedata',
                name : 'stateCd',
                allowNull : true,
                codeDataId : DICT.STATE
            },
            {
                type : 'criterion_codedata',
                name : 'countryCd',
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
                name : 'postalCode',
                type : 'string',
                allowNull : true
            },
            {
                name : 'phone',
                type : 'string',
                allowNull : true
            },
            {
                name : 'isActive',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'schdistName',
                type : 'string',
                allowNull : true
            },
            {
                type : 'criterion_codedata',
                name : 'timezoneCd',
                validators : [VALIDATOR.NON_EMPTY],
                codeDataId : DICT.TIME_ZONE
            },
            {
                name : 'geofence',
                type : 'auto',
                allowNull : true
            },
            {
                name : 'isAllowPunchOutsideGeofence',
                type : 'boolean'
            },
            {
                name : 'isSendPunchOutsideGeofenceNotification',
                type : 'boolean'
            },
            {
                name : 'phoneInternational',
                type : 'string',
                persist : false
            },
            {
                name : 'isPrimary',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isPrimaryForEmployee', // used in criterion.view.employee.demographic.SelectWorkLocations
                type : 'boolean',
                persist : false
            },
            {
                name : 'descriptionCode',
                persist : false,
                calculate : data => data.description + ' [' + data.code + ']'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WORK_LOCATION
        }
    };
});
