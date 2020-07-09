Ext.define('criterion.store.person.Communications', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_person_communications',

        model : 'criterion.model.person.Communication',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_COMMUNICATION
        }
    };

});
