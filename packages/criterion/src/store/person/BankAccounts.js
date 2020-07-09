Ext.define('criterion.store.person.BankAccounts', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_person_bank_accounts',
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.person.BankAccount',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_BANK_ACCOUNT
        }
    };

});
