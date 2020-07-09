Ext.define('criterion.model.employee.OrgTree', function() {

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT_GROUP_TREE,
            appendId : false,
            reader : 'treeData'
        },

        fields : [
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'positionTitle',
                type : 'string'
            },
            {
                name : 'personId',
                type : 'int'
            },
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'combined',
                type : 'string',

                convert : function(newValue, model) {
                    var title = model.get('title'),
                        positionTitle = model.get('positionTitle') ? Ext.util.Format.format(' ({0})', model.get('positionTitle')) : '';

                    return Ext.util.Format.htmlEncode(title + positionTitle);
                }
            },
            {
                name : 'inaccessible',
                type : 'boolean'
            }
        ]

    };
});
