Ext.define('criterion.view.settings.benefits.benefit.Options', function() {

    return {
        alias : 'widget.criterion_settings_benefit_options',

        extend : 'Ext.Panel',

        title : i18n.gettext('Global Settings'),

        requires : [
            'criterion.controller.settings.benefits.benefit.Options'
        ],

        viewModel : {
            record : null
        },

        controller : {
            type : 'criterion_settings_benefit_options'
        },

        items : [
            {
                xtype : 'form',
                reference : 'form',

                defaults : {
                    labelWidth : 160
                },

                items : [
                    {
                        xtype : 'checkbox',
                        fieldLabel : i18n.gettext('Auto-review Benefits'),
                        bind : '{record.autoReview}',
                        listeners : {
                            change : 'onOptionChange'
                        }
                    },
                    {
                        xtype : 'checkbox',
                        fieldLabel : i18n.gettext('Auto-add Benefits'),
                        bind : '{record.autoAdd}',
                        listeners : {
                            change : 'onOptionChange'
                        }
                    },
                    {
                        xtype : 'checkbox',
                        fieldLabel : i18n.gettext('Prompt for benefits recalc'),
                        bind : '{record.promptForRecalc}',
                        listeners : {
                            change : 'onOptionChange'
                        }
                    }
                ]
            }
        ]
    };

});
