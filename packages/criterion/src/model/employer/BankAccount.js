Ext.define('criterion.model.employer.BankAccount', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_BANK_ACCOUNT
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'bankName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name: 'bankAddress',
                type: 'string'
            },
            {
                name : 'accountNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'routingNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reportId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'nextCheckNo',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'horizontalOffset',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'verticalOffset',
                type : 'integer',
                allowNull : true
            },
            {
                name: 'transferId',
                type: 'integer',
                allowNull : true
            },
            {
                name : 'companyIdentifier',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accountOffset',
                type : 'integer',
                defaultValue : 1,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'showIdentifier',
                type : 'boolean'
            },
            {
                name : 'showBackground',
                type : 'boolean'
            },
            {
                name : 'showYtd',
                type : 'boolean'
            },
            {
                name : 'showBenefits',
                type : 'boolean'
            },
            {
                name : 'showTimeOff',
                type : 'boolean'
            },
            {
                name : 'showNotes',
                type : 'boolean'
            },
            {
                name : 'signatureFileName',
                type : 'string'
            },
            {
                name : 'securityRecord',
                type : 'string'
            },
            {
                name : 'enableOffset',
                type : 'boolean'
            }
        ]
    };
});
