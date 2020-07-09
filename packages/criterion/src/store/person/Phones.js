Ext.define('criterion.store.person.Phones', function() {

    var API = criterion.consts.Api.API;

    return {
        alternateClassName : [
            'criterion.store.person.Phones'
        ],

        alias : 'store.criterion_person_phones',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.person.Phone',

        autoSync : false
    };

});
