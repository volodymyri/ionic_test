// @deprecated
Ext.define('criterion.store.CustomForms', function() {

    var API = criterion.consts.Api.API;

    return {

        alias : 'store.criterion_customforms',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.CustomForm',

        proxy : {
            type : 'criterion_rest',
            url : API.CUSTOM_FORM
        },

        autoSync : false

    };

});
