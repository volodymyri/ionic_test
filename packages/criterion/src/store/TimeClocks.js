Ext.define('criterion.store.TimeClocks', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.TimeClock',
        alias : 'store.criterion_time_clocks',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TIME_CLOCK
        }
    };
});

