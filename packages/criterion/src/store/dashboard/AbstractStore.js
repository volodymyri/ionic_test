Ext.define('criterion.store.dashboard.AbstractStore', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
