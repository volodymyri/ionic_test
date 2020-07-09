Ext.define('criterion.store.employer.Overtimes', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_overtimes',

        model : 'criterion.model.employer.Overtime',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_OVERTIME
        }
    };
});

