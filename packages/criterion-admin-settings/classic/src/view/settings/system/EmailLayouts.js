Ext.define('criterion.view.settings.system.EmailLayouts', function() {

    return {

        alias : 'widget.criterion_settings_system_email_layouts',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.system.EmailLayouts',
            'criterion.store.EmailLayouts'
        ],

        controller : {
            type : 'criterion_settings_system_email_layouts'
        },

        viewModel : {
            stores : {
                emailLayouts : {
                    type : 'criterion_email_layouts'
                }
            },

            formulas : {
                hasToField : function(data) {
                    return data('eventType.selection.emailLayoutCode') === criterion.Consts.EMAIL_LAYOUT_CODE.RECRUITING_MASS_REJECTION;
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.gettext('Email Layouts'),

        items : [
            {
                xtype : 'form',

                reference : 'eventForm',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : {
                    padding : '0 40 0 15',
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                    maxWidth : 750
                },

                bodyPadding : '25 10 10',

                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Type'),
                        reference : 'eventType',
                        allowBlank : false,
                        valueField : 'id',
                        displayField : 'emailLayoutDesc',
                        editable : false,
                        queryMode : 'local',
                        bind : {
                            store : '{emailLayouts}'
                        }
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Active'),
                        bind : '{eventType.selection.isActive}'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('From'),
                        bind : '{eventType.selection.fromText}',
                        allowBlank : false
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('To'),
                        hidden : true,
                        bind : {
                            value : '{eventType.selection.toAddress}',
                            hidden : '{!hasToField}',
                            allowBlank : '{!hasToField}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Subject'),
                        bind : '{eventType.selection.subject}',
                        allowBlank : false
                    },
                    {
                        xtype : 'criterion_htmleditor',
                        enableAlignments : false,
                        fieldLabel : i18n.gettext('Body'),
                        bind : '{eventType.selection.body}',
                        allowBlank : false,
                        height : 300
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Revert to default'),
                handler : 'handleRevert'
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                handler : 'handleSubmit'
            }
        ]
    };

});
