Ext.define('criterion.store.employer.Documents', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_documents',

        model : 'criterion.model.employer.Document',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
