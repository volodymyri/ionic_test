Ext.define('criterion.model.payroll.batch.TransmissionFile', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_TRANSMISSION_FILE
        },

        fields : [
            {
                name : 'payrollBatchId',
                type : 'int'
            },
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'fileTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TRANSMISSION_FILE_TYPE
            },
            {
                type : 'criterion_codedatavalue',
                name : 'fileType',
                referenceField : 'fileTypeCd',
                depends : 'fileTypeCd'
            },
            {
                name : 'employerBankAccountId',
                type : 'int'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'createDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'lastDownload',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    if (!data.employerId) {
                        return '';
                    }

                    var employer = Ext.StoreManager.lookup('Employers').getById(data.employerId);

                    return employer ? employer.get('legalName') : '';
                }
            },
            {
                name : 'batchName',
                type : 'string'
            },
            {
                name : 'payDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'year',
                type : 'integer'
            },
            {
                name : 'quarter',
                type : 'string'
            }
        ]
    };
});
