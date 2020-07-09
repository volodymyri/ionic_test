Ext.define('criterion.store.employer.form.Tree', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employer_form_tree',

        extend : 'Ext.data.TreeStore',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.employer.Form',
        autoLoad : false,
        autoSync : false,
        folderSort : true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_FORM_TREE,
            appendId : false,
            reader : {
                type : 'treeData',
                childProperty : 'children'
            }
        }
    };
});
