Ext.define('criterion.view.moduleToolbar.EssSupport', function() {

    return {
        alias : 'widget.criterion_moduletoolbar_ess_support',

        extend : 'Ext.button.Button',

        viewModel : {
            data : {
                available : false
            }
        },

        glyph : criterion.consts.Glyph['ios7-help-empty'],

        tooltip : i18n.gettext('Help'),

        hidden : true,
        bind : {
            hidden : '{!available}'
        },

        constructor : function() {
            var me = this,
                panel = Ext.first('#supportPanel') || Ext.create('criterion.view.ess.Help', {
                    itemId : 'supportPanel',
                    viewModel : {
                        data : {
                            helpButton : me
                        }
                    }
                });

            me.listeners = {
                click : function() {
                    panel.toggle();
                }
            };

            this.callParent(arguments);
        }
    };
});
