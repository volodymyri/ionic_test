Ext.define('criterion.store.AbstractStore', function() {

    return {

        alias : 'store.criterion_abstract_store',

        requires : [
            'criterion.data.field.CodeData'
        ],

        extend : 'criterion.data.Store',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };

});
