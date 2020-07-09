Ext.define('criterion.store.employer.aca.Transmissions', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.aca.Transmission',

        alias : 'store.employer_aca_transmissions',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };

});
