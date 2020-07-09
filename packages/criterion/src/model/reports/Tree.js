Ext.define('criterion.model.reports.Tree', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT_GROUP_TREE,
            appendId : false,
            reader : 'treeData'
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'nameLowerCase',
                calculate : function(data) {
                    return data.name.toLowerCase();
                }
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'custom',
                type : 'boolean'
            },
            {
                name : 'memorized',
                type : 'boolean'
            },
            {
                name : 'typedName',
                calculate : function(data) {
                    return (data.leaf) ? (data.custom) ? data.name + ' *' : data.name : data.name;
                }
            }
        ]
    };
});
