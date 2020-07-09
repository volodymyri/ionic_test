Ext.define('web.view.Main', function() {

    var ROUTES = criterion.consts.Route,
        ADMIN_PACKAGES = criterion.consts.Packages.ADMIN;

    return {
        alias : 'widget.criterion_main',

        extend : 'criterion.ux.Panel',

        requires : [
            'Ext.plugin.Viewport',
            'web.controller.Main',
            'Ext.window.Toast',
            'criterion.ux.button.Split',
            'criterion.ux.form.field.Time'
        ],

        plugins : ['viewport'],

        controller : {
            type : 'criterion_main'
        },

        border : false,
        bodyPadding : 0,
        bodyBorder : false,

        listeners : {
            resize : 'handleResize'
        },

        layout : {
            type : 'card',
            deferredRender : true
        },

        autoScroll : false,

        defaults : {
            header : false
        },

        viewModel : {
            data : {}
        },

        initComponent : function() {
            var me = this;

            var items = [
                {
                    xtype : ADMIN_PACKAGES.HR.BASE_COMPONENT,
                    pkg : ADMIN_PACKAGES.HR.NAME,
                    reference : ROUTES.HR.MAIN
                },
                {
                    xtype : ADMIN_PACKAGES.PAYROLL.BASE_COMPONENT,
                    pkg : ADMIN_PACKAGES.PAYROLL.NAME,
                    reference : ROUTES.PAYROLL.MAIN
                },
                {
                    xtype : ADMIN_PACKAGES.RECRUITING.BASE_COMPONENT,
                    pkg : ADMIN_PACKAGES.RECRUITING.NAME,
                    reference : ROUTES.RECRUITING.MAIN
                },
                {
                    xtype : ADMIN_PACKAGES.SCHEDULING.BASE_COMPONENT,
                    pkg : ADMIN_PACKAGES.SCHEDULING.NAME,
                    reference : ROUTES.SCHEDULING.MAIN
                }
            ];

            me._items = Ext.Array.filter(items, function(item) {
                return criterion.SecurityManager.isAllowedModule(item.reference);
            });

            me.callParent(arguments);

            // getViewModel must be call after component initialization for correct initialization of Ext.rootInheritedState
            me.getViewModel().set('security', criterion.SecurityManager.getSecurityObject());
            me.getViewModel().set('_lngTick', 1);
        }
    };

});
