Ext.define('criterion.store.person.Addresses', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_person_addresses',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.person.Address',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_ADDRESS
        }
    };

});
