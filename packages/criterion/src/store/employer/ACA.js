Ext.define('criterion.store.employer.ACA', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.ACA',

        alias : 'store.employer_acas',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };

});
