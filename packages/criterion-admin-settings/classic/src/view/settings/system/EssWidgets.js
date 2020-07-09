Ext.define('criterion.view.settings.system.EssWidgets', function() {

    return {

        alias : 'widget.criterion_settings_ess_widgets',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.EssWidgets',
            'criterion.model.employer.EssWidgets'
        ],

        controller : {
            type : 'criterion_settings_ess_widgets'
        },

        viewModel : {
            data : {
                record : null,
                widgets : function(){
                    var widgets = {};

                    Ext.Array.each(criterion.Consts.ESS_WIDGETS, function(widget) {
                        widgets[widget.enabledValue] = false;
                    });

                    return widgets;
                }()
            }
        },

        title : i18n.gettext('ESS Widgets'),

        tbar : {
            padding : 0,
            items : [
                {
                    xtype : 'criterion_settings_employer_bar',
                    context : 'criterion_settings',
                    padding : '10 25'
                }
            ]
        },

        bodyPadding : '10 20',

        layout : 'fit',

        listeners : {
            boxready : 'onBoxReady'
        },

        items : [
            {
                xtype : 'container',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                defaultType : 'container',

                items : [
                    {
                        reference : 'columnOne',

                        items : []
                    },
                    {
                        reference : 'columnTwo',

                        items : []
                    }
                ]
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                reference : 'submit',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleSubmitClick'
                }
            }
        ]
    };

});
