Ext.define('criterion.data.reader.TreeData', function() {

    return {
        alias : 'reader.treeData',

        extend : 'Ext.data.reader.Json',

        rootProperty : criterion.consts.Api.DATA_ROOT,
        childProperty : 'sub',
        successProperty : criterion.consts.Api.API.SUCCESS_PROPERTY,

        buildExtractors : function() {
            var me = this,
                res;

            res = me.callParent(arguments);

            me.getRoot = function(data) {
                return data[me.getRootProperty()] || data[me.childProperty];
            };

            return res;
        }
    }
});
