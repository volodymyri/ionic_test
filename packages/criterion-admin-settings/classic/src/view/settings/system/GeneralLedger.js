Ext.define('criterion.view.settings.system.GeneralLedger', function() {

    const TEXT_AREA = criterion.Consts.UI_DEFAULTS.TEXT_AREA,
        textArea6RowHeight = TEXT_AREA.VERTICAL_PADDINGS + TEXT_AREA.LINE_HEIGHT * 6,
        GL_INTERFACE_EXPORT_TYPE_FILE_ID = criterion.Consts.GL_INTERFACE_EXPORT_TYPE_FILE_ID;

    return {

        alias : 'widget.criterion_settings_general_ledger',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.GeneralLedger',
            'criterion.store.employer.GLSetups',
            'criterion.store.Transfers',
            'criterion.store.app.GlExport'
        ],

        controller : {
            type : 'criterion_settings_general_ledger'
        },

        viewModel : {
            data : {
                gLSetupRecord : null
            },
            stores : {
                gLSetup : {
                    type : 'employer_gl_setups',
                    autoSync : false
                },
                transfers : {
                    type : 'criterion_transfers',
                    autoSync : false
                },
                glExportApps : {
                    type : 'criterion_app_gl_export'
                }
            },

            formulas : {
                hideDelete : function(data) {
                    return data('gLSetupRecord') ? data('gLSetupRecord').phantom : true;
                },
                appId : {
                    get : function(get) {
                        let appId = get('gLSetupRecord.appId');
                        return appId ? appId : GL_INTERFACE_EXPORT_TYPE_FILE_ID;
                    },
                    set : function(value) {
                        this.get('gLSetupRecord').set('appId', value === GL_INTERFACE_EXPORT_TYPE_FILE_ID ? null : value);
                    }
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.gettext('General Ledger'),

        bodyPadding : '10 25',

        plugins : [
            'criterion_responsive_column'
        ],

        defaultType : 'container',
        layout : {
            type : 'hbox',
            align : 'stretch'
        },

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

        items : [
            {
                flex : 1,
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                defaults : {
                    labelWidth : 135
                },
                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Type'),
                        valueField : 'id',
                        displayField : 'name',
                        allowBlank : false,
                        editable : false,
                        queryMode : 'local',
                        bind : {
                            store : '{glExportApps}',
                            value : '{appId}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        bind : {
                            value : '{gLSetupRecord.name}'
                        },
                        fieldLabel : i18n.gettext('Name'),
                        allowBlank : false

                    },
                    {
                        xtype : 'extended_combobox',
                        fieldLabel : i18n.gettext('Transfer File'),
                        displayField : 'name',
                        valueField : 'id',
                        queryMode : 'local',
                        allowBlank : true,
                        nullValueText : criterion.Consts.DEFAULT_TRANSFER_NAME,
                        bind : {
                            store : '{transfers}',
                            value : '{gLSetupRecord.transferId}'
                        }
                    },
                    {
                        xtype : 'textareafield',
                        bind : {
                            value : '{gLSetupRecord.parameter1}'
                        },
                        fieldLabel : i18n.gettext('Parameter 1'),
                        height : textArea6RowHeight

                    },
                    {
                        xtype : 'textareafield',
                        bind : {
                            value : '{gLSetupRecord.parameter2}'
                        },
                        fieldLabel : i18n.gettext('Parameter 2'),
                        height : textArea6RowHeight
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                reference : 'delete',
                text : i18n.gettext('Remove'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleDeleteClick'
                },
                hidden : true,
                bind : {
                    hidden : '{hideDelete}'
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                }
            },
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
