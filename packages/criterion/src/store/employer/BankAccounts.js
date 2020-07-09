Ext.define('criterion.store.employer.BankAccounts', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.BankAccount',
        alias : 'store.employer_bank_accounts',

        alternateClassName : [
            'criterion.store.employer.BankAccounts'
        ],

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_BANK_ACCOUNT
        }
    };
});
