Ext.define('criterion.view.ess.dashboard.SignForm', function() {

    return {
        alias : 'widget.criterion_selfservice_dashboard_sign_form',

        extend : 'criterion.ux.window.Window',

        requires : [
            'criterion.controller.ess.dashboard.SignForm',
            'criterion.ux.SignaturePad'
        ],

        controller : 'criterion_selfservice_dashboard_sign_form',

        resizable : false,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        title : i18n.gettext('Add Sign'),

        plugins : {
            ptype : 'criterion_sidebar',
            modal : true,
            width : 600,
            height : 400
        },

        bodyPadding : 10,

        items : [
            {
                xtype : 'criterion_signature_pad',
                reference : 'signaturePad',
                flex : 1
            },
            {
                xtype : 'component',
                padding : 10,
                style : {
                    'text-align' : 'center'
                },
                html : i18n.gettext('Sign above')
            }
        ],

        bbar : [
            {
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'onCancel'
            },
            '->',
            {
                text : i18n.gettext('Clear'),
                ui : 'light',
                handler : 'onClear'
            },
            {
                text : i18n.gettext('Save'),
                handler : 'onSave'
            }
        ]
    }
});