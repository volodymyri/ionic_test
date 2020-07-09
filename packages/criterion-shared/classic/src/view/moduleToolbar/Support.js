Ext.define('criterion.view.moduleToolbar.Support', function() {

    return {
        alias : 'widget.criterion_moduletoolbar_support',

        extend : 'Ext.button.Button',

        cls : 'criterion-moduletoolbar-btn-secondary',
        glyph : criterion.consts.Glyph['ios7-help-outline'],
        tooltip : i18n.gettext('Support'),

        constructor : function() {
            var me = this;

            me.listeners = {
                click : function() {
                    var panel = Ext.first('#supportPanel') || Ext.create('criterion.view.Help', {
                        itemId : 'supportPanel'
                    });

                    panel.toggle();
                }
            };

            this.callParent(arguments);
        }
    };
});
