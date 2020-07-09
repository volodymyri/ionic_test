Ext.define('criterion.store.form.Availables', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_form_availables',

        model : 'criterion.model.form.Available',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.FORM_AVAILABLE
        }
    };
});
