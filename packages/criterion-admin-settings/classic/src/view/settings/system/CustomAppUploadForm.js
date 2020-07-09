Ext.define('criterion.view.settings.system.CustomAppUploadForm', function() {

    return {
        alias : 'widget.criterion_settings_custom_app_upload_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.CustomAppUploadForm'
        ],

        controller : {
            type : 'criterion_settings_custom_app_upload_form',
            externalUpdate : false
        },

        viewModel : {
            data : {
                record : null,
                isPhantom : false
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

        title : i18n.gettext('Custom App'),

        buttons : [
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
                text : i18n.gettext('Install'),
                handler : 'handleInstall'
            }
        ],

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('Manifest File'),
                    name : 'manifestFile',
                    reference : 'manifestFile',
                    buttonText : i18n.gettext('Browse'),
                    buttonConfig : {
                        cls : 'criterion-btn-feature'
                    },
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            var me = cmp;
                            cmp.fileInputEl.on('change', function(event) {
                                me.fireEvent('onselectfile', event);
                            });
                        },
                        onselectfile : 'handleSelectManifestFile'
                    }
                },
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('Jar File'),
                    name : 'jarFile',
                    reference : 'jarFile',
                    buttonText : i18n.gettext('Browse'),
                    buttonConfig : {
                        cls : 'criterion-btn-feature'
                    },
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            var me = cmp;
                            cmp.fileInputEl.on('change', function(event) {
                                me.fireEvent('onselectfile', event);
                            });
                        },
                        onselectfile : 'handleSelectJarFile'
                    }
                }
            ];

            me.callParent(arguments);
        }
    }
});
