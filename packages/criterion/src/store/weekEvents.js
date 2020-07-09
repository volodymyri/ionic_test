Ext.define('criterion.store.weekEvents', function() {

    return {
        alias : 'store.criterion_week_events',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.weekEvent',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WEEK_EVENT
        }
    };

});
