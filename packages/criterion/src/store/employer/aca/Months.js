Ext.define('criterion.store.employer.aca.Months', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.aca.Month',

        alias : 'store.employer_aca_months',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };

});
