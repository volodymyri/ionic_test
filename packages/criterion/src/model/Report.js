Ext.define('criterion.model.Report', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'optionsFileCustom',
                type : 'string'
            },
            {
                name : 'optionsFileStandard',
                type : 'string'
            },
            {
                name : 'reportFileStandard',
                type : 'string'
            },
            {
                name : 'reportGroupId',
                type : 'integer'
            },
            {
                name : 'reportTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.REPORT_TYPE
            },
            {
                name : 'reportTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'reportTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'isCustomReport',
                type : 'boolean',
                persist : false
            }
        ]
    };
});
