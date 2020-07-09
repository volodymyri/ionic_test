Ext.define('criterion.model.Employer', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        alternateClassName : [
            'criterion.model.Employer'
        ],

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'nationalIdentifier',
                type : 'string'
            },
            {
                name : 'legalName',
                type : 'string'
            },
            {
                name : 'alternativeName',
                type : 'string'
            },
            {
                name : 'website',
                type : 'string'
            },
            {
                name : 'nameFormat',
                type : 'string'
            },
            {
                name : 'currencyAtEnd',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'amountPrecision',
                type : 'integer',
                defaultValue : 2
            },
            {
                name : 'ratePrecision',
                type : 'integer',
                defaultValue : 2
            },
            {
                name : 'currencyPrecision',
                type : 'integer',
                defaultValue : 2
            },
            {
                name : 'hoursPrecision',
                type : 'integer',
                defaultValue : 5
            },
            {
                name : 'percentagePrecision',
                type : 'integer',
                defaultValue : 2
            },
            {
                name : 'currencySign',
                type : 'string',
                defaultValue : '$'
            },
            {
                name : 'decimalSeparator',
                type : 'string',
                defaultValue : '.'
            },
            {
                name : 'thousandSeparator',
                type : 'string',
                defaultValue : ','
            },
            {
                name : 'isMultiPosition',
                type : 'boolean'
            },
            {
                name : 'dateFormat',
                type : 'string',
                defaultValue : Ext.Date.defaultFormat
            },
            {
                name : 'timeFormat',
                type : 'string',
                defaultValue : 'g:i A'
            },
            {
                name : 'essColor1',
                type : 'string',
                defaultValue : '#FFFFFF'
            },
            {
                name : 'essColor2',
                type : 'string',
                defaultValue : '#292f3a'
            },
            {
                name : 'essColor3',
                type : 'string',
                defaultValue : '#0495ec'
            },
            {
                name : 'essColor4',
                type : 'string',
                defaultValue : '#3d434e'
            },
            {
                name : 'essColor5',
                type : 'string',
                defaultValue : '#292f3a'
            },
            {
                name : 'essColor6',
                type : 'string',
                defaultValue : '#0495ec'
            },
            {
                name : 'isEssLogo',
                type : 'boolean'
            },
            {
                name : 'isEssEmployerName',
                type : 'boolean'
            },
            {
                name : 'organizationName',
                type : 'string'
            },
            {
                type : 'criterion_codedata',
                name : 'countryCd',
                allowNull : true,
                codeDataId : criterion.consts.Dict.COUNTRY,
                persist : false
            },
            {
                name : 'countryCode',
                type : 'criterion_codedatavalue',
                referenceField : 'countryCd',
                dataProperty : 'attribute1'
            },
            {
                name : 'isPositionControl',
                type : 'boolean'
            },
            {
                name : 'isPositionWorkflow',
                type : 'boolean'
            },
            {
                name : 'isPositionReporting',
                type : 'boolean'
            },
            {
                name : 'isCheckin',
                type : 'boolean'
            },
            {
                name : 'isPercentComplete',
                type : 'boolean'
            },
            {
                name : 'isEssFullDirectory',
                type : 'boolean'
            },
            {
                name : 'testEmailAddress',
                type : 'string'
            },
            {
                name : 'isActive',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'isGlobalEmployeeNumber',
                type : 'boolean'
            }
        ],

        hasMany : {
            model : 'criterion.model.employer.WorkLocation',
            name : 'employerWorkLocations',
            associationKey : 'employerWorkLocations'
        },

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER
        },

        isSelected : function() {
            return this.get('id') === criterion.Api.getEmployerId();
        }
    };
});
