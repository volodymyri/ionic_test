Ext.define('criterion.store.employee.OrgTree', function() {

    return {
        extend : 'criterion.data.TreeStore',
        alias : 'store.employee_org_tree',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.employee.OrgTree',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_ORG_TREE,
            appendId : false,
            reader : {
                type : 'treeData',
                childProperty : 'subordinates'
            }
        }
    };
});
