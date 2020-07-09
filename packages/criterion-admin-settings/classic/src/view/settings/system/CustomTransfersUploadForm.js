Ext.define('criterion.view.settings.system.CustomTransfersUploadForm', function() {

    return {
        alias : 'widget.criterion_settings_custom_transfers_upload_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.CustomTransfersUploadForm'
        ],

        controller : {
            type : 'criterion_settings_custom_transfers_upload_form',
            externalUpdate : false
        },

        viewModel : {
            data : {
                isEdit : false,
                hideIsImport : false
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        draggable : true,
        modal : true,

        listeners : {
            afterrender : 'handleAfterRender'
        },

        title : i18n.gettext('Transfer'),

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-remove',
                text : i18n.gettext('Delete'),
                handler : 'handleDeleteClick',
                bind : {
                    hidden : '{!isEdit}'
                }
            },
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancelClick'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Save'),
                handler : 'handleSave'
            }
        ],

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'criterion_code_detail_field',
                    codeDataId : criterion.consts.Dict.TRANSFER_TYPE,
                    fieldLabel : i18n.gettext('Transfer Type'),
                    name : 'transferTypeCd',
                    bind : {
                        disabled : '{isEdit}'
                    },
                    listeners : {
                        change : 'handleTransferTypeChange'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Name'),
                    name : 'name',
                    reference : 'name',
                    allowBlank : false
                },
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('Transfer File'),
                    name : 'transferFile',
                    reference : 'transferFile',
                    buttonText : i18n.gettext('Browse'),
                    buttonConfig : {
                        cls : 'criterion-btn-feature'
                    },
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    hidden : true,
                    bind : {
                        hidden : '{isEdit}',
                        disabled : '{isEdit}'
                    },
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');

                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            cmp.fileInputEl.on('change', function(event) {
                                cmp.fireEvent('onselectfile', event);
                            });
                        },
                        onselectfile : 'handleSelectTransferFile'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    fieldLabel : i18n.gettext('Is Import'),
                    name : 'isImport',
                    reference : 'isImport',
                    inputValue : true,
                    bind : {
                        hidden : '{hideIsImport}'

                    }
                }
            ];

            me.callParent(arguments);
            me.setKeyNavigation();
        },

        destroy() {
            Ext.destroy(this.keyNav);
            this.callParent();
        },

        setKeyNavigation() {
            let controller = this.getController();

            this.keyNav = new Ext.util.KeyMap({
                target : window,
                binding : [
                    {
                        key : 's',
                        shift : true,
                        alt : true,
                        handler : controller.navSaveHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.ESC,
                        handler : controller.navCancelHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.DELETE,
                        handler : controller.navDeleteHandler,
                        scope : controller
                    }
                ]
            });
        }
    };
});
