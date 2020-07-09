Ext.define('criterion.model.ReportSettings', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'organizationName',
                type : 'string'
            },
            {
                name : 'organizationLogo',
                type : 'auto'
            },
            {
                name : 'isDisplayLogo',
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
                name : 'nameFormat',
                type : 'string'
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
                name : 'isLocalizationEnabled',
                type : 'boolean'
            },
            {
                name : 'isShowCode',
                type : 'boolean'
            },
            {
                name : 'timezoneCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TIME_ZONE
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT_SETTINGS
        }
    };
});
