Ext.define('criterion.model.employee.deduction.EmployeeGarnishment', function() {

    var VALIDATOR = criterion.Consts.getValidator(),
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        },

        fields : [
            {
                name : 'employeeDeductionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'caseNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'garnishmentLienTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.GARNISHMENT_LIEN_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'jurisdictionStateCd',
                type : 'criterion_codedata',
                codeDataId : DICT.STATE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'jurisdictionCounty',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'fipsCode',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'memo',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeeName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'garnishmentPayeeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.GARNISHMENT_PAYEE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeeNameAlternate',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeeAddress1',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeeAddress2',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeeCity',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeeStateCd',
                type : 'criterion_codedata',
                codeDataId : DICT.STATE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payeePostalCode',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'obligeeNationalIdentifier',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'obligeeFirstName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'obligeeMiddleName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'obligeeLastName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerBankAccountId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
