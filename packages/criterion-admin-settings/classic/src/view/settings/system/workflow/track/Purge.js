Ext.define('criterion.view.settings.system.workflow.track.Purge', function() {

    return {
        alias : 'widget.criterion_settings_workflow_track_purge',

        extend : 'criterion.ux.form.Panel',

        title : i18n.gettext('Purge Completed Logs'),

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
                    cmp.up('criterion_settings_workflow_track_purge').fireEvent('cancelAction');
                },
                text : i18n.gettext('Cancel')
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : function(cmp) {
                    var view = cmp.up('criterion_settings_workflow_track_purge'),
                        value = view.down('[name=date]').getValue();

                    if (value) {
                        view.fireEvent('submit', value);
                    }
                },
                text : i18n.gettext('Submit')
            }
        ],

        defaults : {
            labelWidth : 190
        },

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Workflow'),
                allowBlank : false,
                disabled : true,
                bind : '{workflow}',
                flex : 1
            },
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Purge Log Older Than'),
                name : 'date',
                allowBlank : false,
                flex : 1
            }
        ],

        focusFirstField : function() {
            var field = this.down('datefield');

            Ext.Function.defer(function() {
                field && field.focus && field.focus();
            }, 100);
        }
    };

});
