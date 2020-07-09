Ext.define('criterion.store.TeAlternateCalculations', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.TeAlternateCalculation',
        alias : 'store.criterion_te_alternate_calculations',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

