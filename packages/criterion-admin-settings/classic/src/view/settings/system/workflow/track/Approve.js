Ext.define('criterion.view.settings.system.workflow.track.Approve', function() {

    return {
        alias : 'widget.criterion_settings_workflow_track_approve',

        extend : 'criterion.ux.form.Panel',

        title : i18n.gettext('Complete Step'),

        bodyPadding : '20 10',

        viewModel : {

        },

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
                    cmp.up('criterion_settings_workflow_track_approve').fireEvent('cancelAction');
                },
                text : i18n.gettext('Cancel')
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : function(cmp) {
                    var view = cmp.up('criterion_settings_workflow_track_approve'),
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
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Action'),
                allowBlank : false,
                disabled : true,
                name : 'action',
                bind : '{action}',
                flex : 1
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Description'),
                name : 'description',
                height : 100,
                allowBlank : false,
                flex : 1
            }
        ],

        focusFirstField : function() {
            var field = this.down('textarea');

            Ext.Function.defer(function() {
                field && field.focus && field.focus();
            }, 100);
        }
    };

});
