Ext.define('criterion.view.moduleToolbar.SandboxMark', function() {

    return {
        alias : 'widget.criterion_moduletoolbar_sandbox_mark',

        extend : 'Ext.Component',

        cls : 'criterion-moduletoolbar-sandbox-mark',

        html : i18n.gettext('Sandbox'),

        hidden : true,

        constructor : function() {
            var me = this;

            Ext.GlobalEvents.on('isSandbox', function(isSandbox) {
                me.setHidden(!isSandbox);
            });
            this.callParent(arguments);

            this.setHidden(!criterion.Api.getIsSandbox());
        }

    };
});
