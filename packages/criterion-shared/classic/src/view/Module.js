/**
 * Top level view for modules (HR, Payroll, etc).
 */
Ext.define('criterion.view.Module', function() {

    return {
        extend : 'criterion.ux.Panel',

        alias : 'widget.criterion_view_module',

        requires : [
            'criterion.controller.Module'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        header : false,
        defaults : {
            header : false
        },

        initComponent : function() {
            var me = this;

            me.addCls('criterion-module');
            me.callParent(arguments);
        }
    };

});
