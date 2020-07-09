Ext.define('criterion.view.settings.system.workflow.track.Reject', function() {

    return {
        alias : 'widget.criterion_settings_workflow_track_reject',

        extend : 'criterion.ux.form.Panel',

        title : i18n.gettext('Reject'),

        bodyPadding : '20 10',

        viewModel : {},

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        modal : true,
        draggable : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                handler : function(cmp) {
                    cmp.up('criterion_settings_workflow_track_reject').fireEvent('cancelAction');
                },
                text : i18n.gettext('Cancel')
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : function(cmp) {
                    var view = cmp.up('criterion_settings_workflow_track_reject'),
                        desc = view.down('[name=description]').getValue();

                    if (desc) {
                        view.fireEvent('submit', desc);
                    }
                },
                text : i18n.gettext('Submit')
            }
        ],

        items : [
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Description'),
                name : 'description',
                height : 100,
                allowBlank : false,
                flex : 1
            }
        ]
    };

});
