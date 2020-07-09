Ext.define('criterion.model.employer.payroll.Batch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH
        },

        fields : [
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'name',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'payrollPeriodId',
                type : 'int',
                allowNull : true,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'payDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'specialPayPeriodCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.SPECIAL_PAY_PERIOD,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'taxCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TAX_CALC_METHOD
            },
            {
                name : 'payFrequencyCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.PAY_FREQUENCY,
                persist : false
            },
            {
                name : 'payrollScheduleId',
                type : 'integer'
            },
            {
                name : 'periodNumber',
                type : 'integer'
            },
            {
                name : 'isApproved',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isOffCycle',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'offCycleStartDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'offCycleEndDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'offCyclePayDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'originalPayDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'lastPayDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'batchStatusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.BATCH_STATUS,
                allowNull : false,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'batchStatusCode',
                type : 'criterion_codedatavalue',
                dataProperty : 'code',
                referenceField : 'batchStatusCd',
                depends : ['batchStatusCd'],
                persist : false
            },
            {
                name : 'payGroupId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    var employers = Ext.StoreManager.lookup('Employers');

                    return data.employerId ? employers && employers.isLoaded() && employers.getById(data.employerId).get('legalName') : '';
                }
            },
            {
                name : 'employerLegalName',
                type : 'string',
                persist : false
            },
            {
                name : 'isTransmitted',
                type : 'boolean'
            },
            {
                name : 'isExported',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isCalculationInProgress',
                type : 'boolean',
                persist : false
            },
            {
                name : 'calculationProcessId',
                type : 'string',
                persist : false,
                allowNull : true
            },
            {
                name : 'payrollNotes',
                type : 'string'
            }
        ]
    };
});
