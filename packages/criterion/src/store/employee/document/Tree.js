Ext.define('criterion.store.employee.document.Tree', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_document_tree',

        extend : 'Ext.data.TreeStore',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.employee.Document',
        autoLoad : false,
        autoSync : false,
        folderSort : true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_DOCUMENT_TREE,
            appendId : false,
            reader : {
                type : 'treeData',
                childProperty : 'children'
            }
        }
    };
});
