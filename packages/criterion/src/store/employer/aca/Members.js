Ext.define('criterion.store.employer.aca.Members', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.aca.Member',

        alias : 'store.employer_aca_members',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };

});
