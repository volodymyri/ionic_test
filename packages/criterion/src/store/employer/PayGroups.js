Ext.define('criterion.store.employer.PayGroups', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_pay_groups',

        model : 'criterion.model.employer.PayGroup',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAY_GROUP
        }
    };
});
