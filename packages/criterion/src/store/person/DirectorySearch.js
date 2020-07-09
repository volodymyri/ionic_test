Ext.define('criterion.store.person.DirectorySearch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_person_directory_search',

        model : 'criterion.model.person.DirectorySearch',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_DIRECTORY_SEARCH
        }
    };

});
