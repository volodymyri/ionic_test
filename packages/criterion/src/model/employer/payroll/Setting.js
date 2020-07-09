Ext.define('criterion.model.employer.payroll.Setting', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_SETTINGS
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'checkProcessingCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PTSC,
                allowNull : true
            },
            {
                name : 'checkProcessingCode',
                type : 'criterion_codedatavalue',
                referenceField : 'checkProcessingCd',
                dataProperty : 'code'
            },
            {
                name : 'achProcessingCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PTSC,
                allowNull : true
            },
            {
                name : 'achProcessingCode',
                type : 'criterion_codedatavalue',
                referenceField : 'achProcessingCd',
                dataProperty : 'code'
            },
            {
                name : 'taxFilingCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PTSC,
                allowNull : true
            },
            {
                name : 'newHireReportingCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PTSC,
                allowNull : true
            },
            {
                name : 'importFileFormat',
                type : 'string'
            },
            {
                name : 'attribute1',
                type : 'string'
            },
            {
                name : 'attribute2',
                type : 'string'
            },
            {
                name : 'employerTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EMPLOYER_TYPE,
                allowNull : true
            },
            {
                name : 'isOverrideTax',
                type : 'boolean'
            },
            {
                name : 'isOverrideRate',
                type : 'boolean'
            },
            {
                name : 'isPieceratePay',
                type : 'boolean'
            },
            {
                name : 'taxEngineCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TAX_ENGINE
            },
            {
                name : 'taxEngineCode',
                type : 'criterion_codedatavalue',
                referenceField : 'taxEngineCd',
                dataProperty : 'code'
            },
            {
                name : 'isSplitByWeek',
                type : 'boolean'
            },
            {
                name : 'isWcOnOvertime',
                type : 'boolean',
                defaultValue : false
            }
        ]
    };
});
