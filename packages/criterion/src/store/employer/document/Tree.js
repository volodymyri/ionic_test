Ext.define('criterion.store.employer.document.Tree', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employer_document_tree',

        extend : 'Ext.data.TreeStore',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.employer.Document',
        autoLoad : false,
        autoSync : false,
        folderSort : true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_DOCUMENT_TREE,
            appendId : false,
            reader : {
                type : 'treeData',
                childProperty : 'children'
            }
        }
    };
});
