Ext.define('criterion.controller.settings.benefits.benefit.OptionsGrid', function() {

    return {
        alias : 'controller.criterion_settings_benefit_options_grid',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.settings.benefits.benefit.OptionForm'
        ],

        editor : {
            xtype : 'criterion_settings_benefit_option_form',
            allowDelete : true
        },

        connectParentView : false,

        createEditor : function(editor, record) {
            editor = Ext.apply(editor, {
                title : i18n.gettext('Option'),
                viewModel : {
                    formulas : {
                        hideDelete : function() {
                            return !record.get('name')
                        }
                    }
                }
            });

            return this.callParent([editor, record]);
        }
    };

});
